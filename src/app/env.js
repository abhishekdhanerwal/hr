
(function (window) {
  window.__env = window.__env || {};

  var environment = "dev"; //can be dev, test or prod.qa

    if(environment === "qa"){
      window.__env.dataServerUrl = 'http://ec2-user@ec2-54-167-53-75.compute-1.amazonaws.com:8080';
      window.__env.baseUrl = '/';
      window.__env.enableDebug = true;
      window.__env.user = "user0@datiot.com";
      window.__env.password = "";
    }
    else  {
      window.__env.dataServerUrl = 'http://localhost:8080';
      window.__env.baseUrl = '/';
      window.__env.enableDebug = true;
      window.__env.user = "user0@datiot.com";
      window.__env.password = "secret";
    }

}(this));

