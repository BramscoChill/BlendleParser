export const sortedIssues = (issues) => {
  let result = {
    issues: [],
    favoritedIssues: [],
  };

  result = issues.reduce((prevResult, issue) => {
    const isFavourite = issue.get('favourite');
    if (isFavourite) {
      result.favoritedIssues.push(issue);
    } else {
      result.issues.push(issue);
    }

    return result;
  }, result);

  return [...result.favoritedIssues, ...result.issues];
};



// WEBPACK FOOTER //
// ./src/js/app/selectors/issues.js