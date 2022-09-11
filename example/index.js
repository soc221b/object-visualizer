fetch('https://jsonplaceholder.typicode.com/users')
  .then((response) => response.json())
  .then((data) => {
    const app = Vue.createApp(ObjectVisualizer.ObjectVisualizer, {
      data,
      rootName: 'users',
      getKeys: (object) => Object.keys(object).sort(),
    })
    app.mount(document.getElementById('app'))
  })
