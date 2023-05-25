// import request from "./request";

const user = {
  async login({ username, password }) {
    try {
      if (username === "digitalbrain" && password === "juece") {
        return Promise.resolve({
          id: "digitalbrain",
          name: "digitalbrain",
          time: new Date().getTime(),
        });
      } else {
        return Promise.reject("用户名或者密码错误");
        // const { data } = await request.post("/user/auth/login", {
        //   email: username,
        //   password,
        // });
        // return {
        //   id: username,
        //   name: username,
        //   time: new Date().getTime(),
        //   token: data.result,
        // };
      }
    } catch (error) {
      return Promise.reject("用户名或者密码错误");
    }
  },
};

const userInfo = {
  key: "dbcj-user",
  expire: 2 * 24 * 60 * 60 * 1000,
  set: (v) => {
    try {
      localStorage.setItem(userInfo.key, window.btoa(JSON.stringify(v)));
    } catch (error) {
      console.error(error);
    }
  },
  get: () => {
    try {
      const v = localStorage.getItem(userInfo.key);
      if (!v) {
        return null;
      }
      const data = JSON.parse(window.atob(v));
      if (new Date().getTime() - data.time > userInfo.expire) {
        localStorage.removeItem(userInfo.key);
        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  remove: () => {
    try {
      localStorage.removeItem(userInfo.key);
    } catch (error) {
      console.error(error);
    }
  },
};

export { userInfo };

export default user;
