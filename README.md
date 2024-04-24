<h1>Bookend</h1>
<p>Capstone project by Mitchell Eldridge - University of Nebraska at Omaha</p>
<br><br>

<h2>Description</h2>
<br><br>

<h2>Local Installation and Development Environment Execution Instructions</h2>
<br>
<h3>Dependencies</h3>
<ul>
  <li>Entity Framework 7</li>
  <li>Angular 16</li>
</ul>

<br>

<h3>Steps</h3>
<ol>
  <li>Install dependencies</li>
  <li>Clone github repository to local repo</li>
  <li>Inside angular application directory, execute `npm install`</li>
  <li>Update Cloudinary settings in appsettings.json to use a valid Cloudinary account. Create an attribute named `CloudinarySettings` with child attributes:
  </li>
  <ul>
    <li>CloudName</li>
    <li>ApiKey</li>
    <li>ApiSecret</li>
  </ul>
  <li>To run the program, you can simply execute `dotnet run` inside the .NET application directory to run the most recent version of the Angular app - access at `https://localhost:5000` or `https://localhost:5001` or follow the additional steps below to run the .NET app and Angular apps separately.</li>
  <li>Inside .NET application directory, execute `dotnet watch` command</li>
  <li>Once application is started, execute `ng serve` command in angular application directory</li>
  <li>Navigate to `https://localhost:4200` in a web browser</li>
</ol>