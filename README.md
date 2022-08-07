# Corpus & Repository (Frontend)
This is the source code for the front-end of a web-based corpus. What does that mean? A corpus is a collection of texts which can be searched & analyzed. A front-end is the part of a web application that is responsible for the user interface, for sending requests for data & queries to the "back-end," and then displaying that data.

This front-end is designed for a specific dataset, the Corpus and Repository of Writing (Crow), which is an inter-institutional collection of student writing. However, it can also provide a starting point for designing a corpus with a different dataset. And the Crow team is available for support & consulting.

For the live version of the site, visit https://crow.corporaproject.org.

# Table of contents
* [Quickstart](#quickstart)
* [The architecture of this web-based corpus](#architecture)
* [Building your own corpus](#building-your-own-corpus)
* [How to make changes to the code](#usage)
* [How to construct requests via the API](#the-api)

# Quickstart
(This assumes [NodeJS](https://nodejs.org/en/) is installed.)
1. Adjust the backend host as needed in `src/environments/environment.ts`
2. Get a local host running:
```
git@github.com:writecrow/crow_frontend.git
npm install
npm install -g @angular/cli
ng serve
```

# Architecture
Corpora are big-data applications. They must be able to perform complex searches on large datasets. Thanks to the precedents of Google and Amazon, people expect web-based search portals to be fast. Very fast. In order to meet this expectation, a number of contemporary web design patterns must be followed:

- **Decoupled display/data** (see https://pantheon.io/decoupled-cms): instead of delivering all of a web page every time a user performs an action, only update the part of the web page that needs to change.
- **Multiple layers of caching**: the result of computational operations that will yield the same result (until the dataset is updated) can be stored and the memory-intensive operation can be skipped.
- **Search index pre-processing**: each searchable thing (i.e. word) in each resource (i.e., text) in the dataset (i.e, the corpus) must be indexed beforehand so that millions of words don't have to be individually crawled at runtime.

In order to achieve the above, this site was built:
- Using [AngularJS](https://angularjs.org/), a JavaScript framework whose business logic lives in the browser (and therefore greatly reduces the amount of data that must be sent across the internet on each user action)
- Using time-based caching on the front-end, and change-sensitive caching on the back-end
- Using pre-loading of data from the back-end to predict the data a user may request before it is requested

# Building your own corpus
Developing a modern web application requires a not insignificant amount of knowledge not only about a given programming language, but also about programming principles, how data is transferred across the internet, and about the specific framework on which an application is built (in this case, [AngularJS](https://angularjs.org/)). 

The following section will explain how to get up and running for developing with this application, but be forewarned: it may be daunting for non-developers; at the bare minimum, it assumes a familiarity with the command line, `git`, package management, integrated development environments, and local hosting.

These instructions also assume a UNIX-like environment (e.g., Linux, Mac), so if you're using Windows, you'll need to make some accommodations.


1. If you haven't done so, install `node.js` & `npm` : https://docs.npmjs.com/getting-started/installing-node
1. Download this repository as you would normally: `git clone https://github.com/writecrow/corpus_frontend.git`
1. From the directory of the download, run `npm install` to build local components.
1. Run `ng serve` for a dev server. 
1. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Compiling the code for production

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

# Usage
This application is built on the [Angular](https://angularjs.org/) framework, and follows the best practices of said framework. For those familiar with AngularJS, making modifications to the code should be self-obvious.

However, for complete beginners, here are a few orientation tips for making general changes, assuming you have successfully got the site running locally at `http://localhost:4200/`; see above):

- All functional code is located in the `src/app` directory
- The file that defines the "pages" (routes) is `src/app/app.module.ts`
- The back-end base URL is defined in `src/app/api/restAPI.service.ts`. If you have a different back-end, change it here.

Each "component" of the application consists of 
- the `.ts` file, which controls the business logic of route, and the dynamic variables available to the template
- the `.html` file, which defines the markup that will display on the page, and the placeholders for the dynamic data which can be passed from the `.ts` file
- the `.css` file, which adds display elements to the component

# The API
All dynamic data is retrieved from the backend API, whose base URL is defined in `src/app/api/restAPI.service.ts`.

Requests for specific data can be performed by the parameters explained in the backend repository, at https://github.com/writecrow/corpus_backend#performing-search-requests-via-the-api

For example, the following URL:

https://writecrow.corporaproject.org/texts/word?search=friend+woman&op=or&_format=json

will return all texts via a standard word search that include the word "friend" or "woman", returned in JSON format. 

The same result could be returned in XML format with the URL:

https://writecrow.corporaproject.org/texts/word?search=friend%20woman&op=or&_format=xml

A result set that requires "friend" AND "woman" would be: 

https://writecrow.corporaproject.org/texts/word?search=friend%20woman&op=and&_format=json

For a systematic explanation of requesting data from the back-end, see https://github.com/writecrow/corpus_backend#performing-search-requests-via-the-api


## Development server
This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Updating Angular
Replace `@13` with the target version, along with the applicable typescript version specified by the command's output.

```
ng update @angular/core@13 @angular/cli@13 @angular-eslint/builder@13 @angular-eslint/schematics@13 @angular/platform-browser-dynamic@13 @angular/router@13 @angular/platform-browser@13 @angular/material@13 @angular/forms@13 @angular/compiler@13 @angular/cdk@13 @angular/animations@13 @angular-devkit/build-angular@13 @angular/compiler-cli@13 @angular/language-service@13 typescript@4.4
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
