const http = require('http');

let employeeData = [
  {
    "_id": "5ec02a53d8ba79b6992ba757",
    "name": {
      "first": "Pace",
      "last": "Simmons"
    },
    "company": "MOLTONIC",
    "email": "pace.simmons@moltonic.co.uk",
    "phone": "+1 (941) 562-2930",
    "address": "274 Dikeman Street, Somerset, Nevada, 6375"
  }
];

let findEmployee = (id) => {
  return employeeData.find((employee)=>{
    if (employee._id === id) {
      return employee;
    }
  });
}

const getMethodHandler = (url, req, res) => {
  const employeeId = url.substring(1);
  const employee = findEmployee(employeeId);
  if(!employee) {
    res.writeHead(400);
    res.end(`The employee with id ${employeeId} is not present.`);
    return;
  }

  res.writeHead(200);
  res.end(JSON.stringify(employee));
}

const requestListener = function (req, res) {
  try {
    entryCheck(req);
    const methodType = req.method.toUpperCase();
    const url = req.url;
    switch (methodType) {
      case 'GET':
        getMethodHandler(url, req, res);
        break;
      case 'POST':

        break;
      case 'PUT':

        break;
      case 'DELETE':

        break;

      default:
        break;
    }
  } catch (error) {
    res.writeHead(400);
    res.end(error.message);
  }
}
const REQUIRED_CONTENT_TYPE = 'application/json';
const ACCEPT_ENCODING_1 = 'application/json';
const ACCEPT_ENCODING_2 = '*/*';

const entryCheck = function (req) {
  const contentType = req.headers['content-type'];
  if (!contentType.includes(REQUIRED_CONTENT_TYPE)) {
    throw new Error("Sorry we only support content type as json format.");
  }

  const accept = req.headers['accept'];
  if (!contentType.includes(ACCEPT_ENCODING_1) || contentType.includes(ACCEPT_ENCODING_2)) {
    throw new Error("Sorry we only support json format.");
  }
}

const server = http.createServer(requestListener);
server.listen(8090);
