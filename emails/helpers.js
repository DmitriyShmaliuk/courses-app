module.exports = {
  replaceLink({ template, link, replacedText }) {
    const startIndex = template.indexOf(replacedText);
    const endIndex = startIndex + replacedText.length;

    return template.slice(0, startIndex) + link + template.slice(endIndex);
  }
};