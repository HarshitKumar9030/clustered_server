const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');

const server1Path = path.join(__dirname, '..', 'server1_videos');
const server2Path = path.join(__dirname, '..', 'server2_videos');
const maxStorageSize = 40 * 1024 * 1024 * 1024; // 40 GB

// Ensure the directories exist
if (!fs.existsSync(server1Path)) {
  fs.mkdirSync(server1Path, { recursive: true });
}
if (!fs.existsSync(server2Path)) {
  fs.mkdirSync(server2Path, { recursive: true });
}

const checkStorageSize = (storagePath) => {
  const files = fs.readdirSync(storagePath).map(file => {
    const filePath = path.join(storagePath, file);
    const stat = fs.statSync(filePath);
    return { file: filePath, size: stat.size, mtime: stat.mtime };
  });

  let totalSize = files.reduce((acc, curr) => acc + curr.size, 0);

  if (totalSize > maxStorageSize) {
    files.sort((a, b) => a.mtime - b.mtime);

    for (const file of files) {
      if (totalSize <= maxStorageSize) break;
      fs.unlinkSync(file.file);
      totalSize -= file.size;
    }
  }
};

const storeVideo = (videoStream, videoId, format, storagePath) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(storagePath, `${videoId}.${format}`);
    const fileStream = fs.createWriteStream(filePath);

    videoStream.pipe(fileStream)
      .on('finish', () => {
        resolve(filePath);
        checkStorageSize(storagePath);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const serveVideo = (filePath, res) => {
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
};

const findVideo = (videoId, format) => {
  const server1FilePath = path.join(server1Path, `${videoId}.${format}`);
  const server2FilePath = path.join(server2Path, `${videoId}.${format}`);

  if (fs.existsSync(server1FilePath)) {
    return server1FilePath;
  }
  if (fs.existsSync(server2FilePath)) {
    return server2FilePath;
  }
  return null;
};

module.exports = { storeVideo, serveVideo, findVideo, server1Path, server2Path };
