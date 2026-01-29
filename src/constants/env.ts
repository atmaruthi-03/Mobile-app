// export const ENV = {
//   // Use http://10.0.2.2:8000 for Android Emulator loopback to host
//   API_URL: 'http://10.0.2.2:8000',
//   // API_URL: 'https://purelight-afb.pathsetter.ai/',
// };

export const ENV = {
  API_URL: __DEV__
    ? 'http://192.168.3.131:8000' // <-- YOUR LAPTOP IP
    : 'https://purelight-afb.pathsetter.ai',
};

