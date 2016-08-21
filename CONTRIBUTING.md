# Holmes-Frontend: A Webfrontendd for Holmes Processing

## Contributing 

Contributions are always welcome! If you are unsure about something you would like to implement feel free to open a new issue to discuss your idea.

That beeing said please understand that the core team will always discuss and decide wether or not a new feature should be added to the project.


## How to add a new special display for a service 

If you are a service author and want to create a special display for your service so that the data isn't just shown as raw JSON you just have to follow these easy steps.

Create a new file in the `modules/results/services/` folder and name it myService.js where myService should be the name of your service.

There is just one mandatory function you need to have in your js file: the `render_result(r)` function which is called by the main script. The first and only parameter is the JSON data your service returned as result.

You can use the `#results-presentation` div to display charts or other data, as an example simply take a look at the virustotal.js file.
