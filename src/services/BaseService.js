import getDomain from './Env';

const web3 = new Web3(getDomain());
export async function request(
  url = '',
  data = {},
  mock = { on: false, data: {} },
  method = 'get',
  scopes = false,
  dataType = 'json'
) {
  if (mock.on) {
    return new Promise(resolve => {
      resolve(mock.data);
    });
  }
  let res = null;
  
}
