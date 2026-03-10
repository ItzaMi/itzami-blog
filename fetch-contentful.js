const contentful = require('contentful');

const client = contentful.createClient({
  space: 'jmotdpsipbdp',
  accessToken: '_olRCVw8c9ZHhFjK-B0ns-wLzMq9hytsJajGYQqp4EY'
});

client.getEntries({ content_type: 'blogPost' })
  .then((response) => {
    console.log(JSON.stringify(response.items, null, 2));
  })
  .catch(console.error);
