Ideas:

- Use text file to hold list of pages to be redirected (pages.txt)
- Use a template language to

To Do:

- Add boilerplate stuff (license, contributing)
- Add readme
- Add tests
  - Maybe run a Docker and run tests from the host to the docker?
- HSTS headers?
- list of pages https://docs.google.com/spreadsheets/d/1LLETqEnpRVzMftfTYz7zzoHGgg8WFzM45PtKBZaC1SA/edit#gid=0
- WANT to be able to have a DIFFERENT name (pages.18f.gov/whatever -> whatever-else.18f.gov)
  - maybe have a space in between
- test in CI
  - travis can run docker and docker-compose: https://docs.travis-ci.com/user/docker/
    - idea: run docker-compose, run `node test.js`

cloud.gov:
  - ORG: gsa-18f-federalist
  - SPACE: redirects
  - hook up pages-test.18f.gov and guides-test.18f.gov
