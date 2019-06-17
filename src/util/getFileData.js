import DICT from '@/util/dict.js'
const config = {
  pageSize: 30,
  token: 1,
  try: 3,
  interval: 0,
  isEnd: false
};

const sleep = function (times) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("ok");
    }, times);
  });
};

async function getPapes(api, params, index) {
  let addList = [];
  const pages = [];
  for (let i = 0; i < config.token; i++) {
    pages.push(index * config.token + i + 1);
  }

  try {
    const response = await Promise.all(pages.map(page => {
      return api({
        ...params,
        startpage: page,
        pageSize: config.pageSize
      });
    }));
    const temp = response.map(row => {
      if (row.code === DICT.SUCCESS) {
        return row.data.list;
      } else {
        return false;
      }
    });
    // console.log(temp);
    if (temp.indexOf(false) === -1) {
      temp.forEach(row => {
        addList = [...addList, ...row];
      });
    }
    return addList;
  } catch (error) {
    return addList;
  }
}

export default async function getData(api, params) {
  debugger
  let loop = [];
  const errors = [];
  let addList = [];
  let i = 0;
  while (config.isEnd === false) {
    for (let t = 0; t < config.try; t++) {
      console.log("file data try:" + (t + 1), "chunk:" + (i + 1), Date.parse(new Date()));
      await sleep(config.interval);
      loop[i] = await getPapes(api, {...params}, i);
      if (t !== config.try - 1 && loop[i] === false) {
        config.isEnd = true;
      } else {
        if (loop[i].length < config.pageSize * config.token) {
          config.isEnd = true;
        }
        i = i + 1;
        break;
      }

    }
  }

  config.isEnd = false;
  loop.forEach((row, index) => {
    if (row.length > 0) {
      addList = [...addList, ...row];
    } else {
      errors.push(index + 1);
    }
  });

  if (errors.length > 0) {
    addList = [];
  }
  return addList;
}
