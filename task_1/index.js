import {encoded, translations} from './data.js'

console.log("Let's rock")
console.log(encoded, translations);

function decodeFields(data, translationDict) {
  const decodedData = [];

  data.forEach(item => {
    const decodedItem = {};
    Object.keys(item).forEach(key => {
      if (key.endsWith('Id') && !['groupId', 'service', 'formatSize', 'ca'].includes(key)) {
        const decodedKey = key.substring(0, key.length - 2);
        decodedItem[decodedKey] = translationDict[item[key]] || item[key];
      } else {
        decodedItem[key] = item[key];
      }
    });
    decodedData.push(decodedItem);
  });

  return decodedData;
}

const decoded = decodeFields(encoded, translations);

console.log("Decoded data:", decoded);

// Вывод уникальных id
const uniqueIds = [...new Set(encoded.flatMap(item => Object.values(item)))];
console.log("Unique ids:", uniqueIds);