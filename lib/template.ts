const t = `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">

    <link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" media="screen">
    <link rel="stylesheet" type="text/css" href="stylesheets/github-dark.css" media="screen">

    <title>Blog</title>
  </head>

  <body>

    <header>
      <div class="container">
        <h1>Blog</h1>
      </div>
    </header>

    <div class="container">
      <section id="main_content">
        {{#each data}}
        <h3>{{{subject}}}</h3>
        <p>{{{body}}}</p>
        {{/each}}
      </section>
    </div>

    
  </body>
</html>`
export default t