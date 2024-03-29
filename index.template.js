const fs = require("fs");
const mkdirp = require("mkdirp");

const sliceByNumber = (array, number) => {
  const length = Math.ceil(array.length / number)
  return new Array(length).fill().map((_, i) =>
    array.slice(i * number, (i + 1) * number)
  )
};

async function generate(name, job, works, schools, skills, email, output) {
  let template = fs.readFileSync(__dirname + "/index.template.html", "utf8");
  template = template.replace("#{NAME}", name);
  template = template.replace("#{JOB}", job);
  template = template.replace("#{WORKS}", sliceByNumber(works.map(work => {
    return `
      <div class="work" ontouchstart="">
        <a href="" target="_blank">
          <img src="./images/${work.image}">
          <div class="work-detail">
          <span class="work-title">${work.title}</span>
          <p>${work.description}</p>
          </div>
        </a>
      </div>
    `
  }), 3).map(row => {
    return `
      <div class="row">
        ${ row.join("") }
      </div>
    `
  }));
  template = template.replace("#{SCHOOLS}", schools.map(school => {
    return `
      <p>${school}</p>
    `
  }).join(""));
  template = template.replace("#{SKILLS}", skills.map(skill => {
    return `
      ${skill}<br/>
    `
  }).join(""));
  template = template.replace("#{EMAIL}", email);

  await mkdirp(output + "/portfolio");
  await mkdirp(output + "/portfolio/images");
  await fs.copyFileSync(__dirname + "/index.css", output + "/portfolio/index.css");
  fs.writeFileSync(output + "/portfolio/index.html", template);
}


module.exports = generate;


