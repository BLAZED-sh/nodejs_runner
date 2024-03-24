import express from 'express';
import ivm from 'isolated-vm';
import fs from 'fs';

const app = express();
app.use(express.json());

app.post('/run', async (req, res) => {
  const isolate = new ivm.Isolate({ memoryLimit: 1024 });
  const context = isolate.createContextSync();
  const jail = context.global;


  jail.setSync('global', jail.derefInto());

  let log: any = [];
  jail.setSync('log', function(...args) {
    console.log(...args);
    log.push(...args);
  });

  jail.setSync('atob', function(data: string) {
    return atob(data);
  });

  jail.setSync('btoa', function(data: string) {
    return btoa(data);
  });

  jail.setSync('setTimeout', function(callback: Function, ms: number) {
    setTimeout(() => {
      callback();
    }, ms);
  }, { reference: true });

  jail.setSync('setInterval', function(callback: Function, ms: number) {
    setInterval(() => {
      callback();
    }, ms);
  }, { reference: true });

  const ethersCode = fs.readFileSync('node_modules/ethers/dist/ethers.esm.js', 'utf8');
  const ethersModule = isolate.compileModuleSync(ethersCode);
  ethersModule.instantiateSync(context, (specifier) => {
    if (specifier === 'ethers') {
      return ethersModule;
    }
    throw new Error(`Cannot find module ${specifier}`);
  });

  /*
  const web3Code = fs.readFileSync('node_modules/web3/dist/web3.min.js', 'utf8');
  const web3Module = isolate.compileModuleSync(web3Code);
  web3Module.instantiateSync(context, (specifier) => {
    if (specifier === 'web3') {
      return web3Module;
    }
    throw new Error(`Cannot find module ${specifier}`);
  });*/

  try {
    const module = isolate.compileModuleSync(req.body.code);
    module.instantiateSync(context, (specifier) => {
      if (specifier === 'ethers') {
        return ethersModule;
      }
      throw new Error(`Cannot find module ${specifier}`);
    });

    module.evaluateSync();
  } catch (err) {
    res.json({ log: [err instanceof Error ? err.message : JSON.stringify(err)] });
    return;
  }

  res.json({ log });
});

app.listen(3000, () => {
  console.log('Server is running on :3000');
});
