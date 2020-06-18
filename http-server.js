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

let addEmployee = (employee) => {
  employeeData.push(employee)
}

let findAndReplace = (employee) => {
  let employeeFound = findEmployee(employee._id);
  if (employeeFound) {
    for (let key in employee) {
      employeeFound[key] = employee[key];
    }
    return true;
  } else {
    return false;
  }
}

let deleteEmployee = (id) => {
  let length = employeeData.length;
  while (length--) {
    if (employeeData[length] && employeeData[length]['_id'] === id) {
      employeeData.splice(length,1);
      return true;
    }
  }

  return false;
}

const getRequestBodyAndGenerateResponse = (req, res, callback) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    callback(res, JSON.parse(body));
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

const putMethodHandler = (res, body) => {
  let resBody = body;
  findAndReplace(reqBody);
  res.writeHead(200);
  res.end(`The Employee object with id is ${resBody._id} replaced.`);
}

const postMethodHandler = (res, body) => {
  try {
    let resBody = body;
    addEmployee(reqBody);
    res.writeHead(200);
    res.end(`The Employee object with id is ${reqBody._id} added.`);
  } catch (error) {
    res.writeHead(400);
    res.end(error.message);
  }
}

const deleteMethodHandler = (url, req, res) => {
  const employeeId = url.substring(1);
  const response = deleteEmployee(employeeId);
  res.writeHead(200);
  res.end(`The employee with id ${employeeId} is deleted.`);
}

const requestListener = function (req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');
    entryCheck(req);
    const methodType = req.method.toUpperCase();
    const url = req.url;
    switch (methodType) {
      case 'GET':
        getMethodHandler(url, req, res);
        break;
      case 'POST':
        getRequestBodyAndGenerateResponse(req, res, postMethodHandler);
        break;
      case 'PUT':
        getRequestBodyAndGenerateResponse(req, res, putMethodHandler);
        break;
      case 'DELETE':
        deleteMethodHandler(url, req, res);
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
  console.log(req.headers);
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
