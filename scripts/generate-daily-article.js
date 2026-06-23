import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const topics = JSON.parse(fs.readFileSync(
  path.join(__dirname, "daily-topics.json"), "utf8"
));

function getNextIndex() {
  const indexPath = path.join(__dirname, "..", ".daily-index.json");
  try {
    if (fs.existsSync(indexPath)) {
      return (JSON.parse(fs.readFileSync(indexPath, "utf8")).index + 1) % topics.length;
    }
  } catch (e) {}
  return 0;
}

function saveIndex(index) {
  fs.writeFileSync(
    path.join(__dirname, "..", ".daily-index.json"),
    JSON.stringify({ index, lastUpdate: new Date().toISOString() })
  );
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function makeFrontmatter(title, description, date) {
  return `---
title: "${title}"
description: "${description}"
pubDate: ${date}
---
`;
}

function generate() {
  const idx = getNextIndex();
  const topic = topics[idx];
  const slug = slugify(topic.title);
  const today = new Date().toISOString().split("T")[0];
  const outDir = path.join(__dirname, "..", "src", "content", "posts");
  const filepath = path.join(outDir, slug + ".md");

  if (fs.existsSync(filepath)) {
    saveIndex((idx + 1) % topics.length);
    return generate();
  }

  const md = makeFrontmatter(topic.title, topic.description, today) +
    "# " + topic.title + "\n\n" +
    topic.content.join("\n") + "\n";

  fs.writeFileSync(filepath, md, "utf8");
  saveIndex(idx);

  console.log("Generated: " + slug + ".md");
  console.log("Title: " + topic.title);
  return { file: slug + ".md", title: topic.title };
}

console.log(JSON.stringify(generate()));
