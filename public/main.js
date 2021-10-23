async function makeRequest(route, body,authHeader) {

    let requestType = "GET";
    if (body) requestType = "POST";
  
    let headerParam = {
      withCredentials: true,
      "Content-type": "application/json",
      Authorization : authHeader
    };
  
  
    let requestObject = {
      method: requestType,
      headers: headerParam,
    };
    if (body) requestObject.body = JSON.stringify(body);
    console.log(requestObject.body);
    let res = await fetch(route, requestObject);
    let jsonData = await res.json();
    return jsonData;    
  }

  

  async function sendSignUp(){
    const form = document.getElementById("signup");
    const username = form.children[0].value;
    const pass = form.children[1].value;
    const body = {
        username:username,
        password:pass
    }
    

    await makeRequest("/api/signup",body);
  }

  async function sendSignIn(){
    const form = document.getElementById("signin");
    const username = form.children[0].value;
    const pass = form.children[1].value;
    const body = {
        username:username,
        password:pass
    }
  
     makeRequest("/api/signin",body).then((res)=>{
      localStorage.setItem("token",res.token);
     });
  }

  async function sendMovie(){
    const form = document.getElementById("list");
    const username = form.children[0].value;
    const movie = form.children[1].value;
    const rating = form.children[2].value;
    const body = {
      username:username,
      movie:movie,
      rating:rating
    }
    makeRequest("/api/user",body).then(console.log);
  }

  async function getMovie(){
    var token = localStorage.getItem("token");
    const auth = "Bearer "+token;
  await fetch("/api/user-content",{method:"GET",headers:{Authorization:auth}});
  }

