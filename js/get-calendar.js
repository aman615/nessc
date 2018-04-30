      // Client ID and API key from the Developer Console
      var CLIENT_ID = '260947750296-ivjdbglqardvthbsmdq9sk91lftn4g2a.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyCcfIrz9bUWiXSoBL6_HxsfuDIUmI3EN2M';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      //var maxResults = document.getElementById('max-results').value;
      var d = new Date();
      d.setDate(d.getDate()+40);
      
      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        //console.log(maxResults);
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listUpcomingEvents();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'timeMax': d.toISOString(),
          'orderBy': 'startTime'
        }).then(function(response) {
            var prevDay = '';
          var events = response.result.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {          
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];                      
            var content = '<h2 align="center">Gurdwara Sahib Programs</h2><table><col width="20%"><col width="80%"> ';
            
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              var eventDate = new Date(when);
              var day = weekday[eventDate.getDay()];
              var month = monthNames[eventDate.getMonth()]
              time = eventDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
              if (day == prevDay) {
                content += '<tr><td>' + time + ' ' + '</td><td>' + event.summary + '</td></tr>';
              } else {
                content += '<tr style="background-color: lightskyblue"><th>' + day + '</th>' +  '<th style="align:left">' + month + ' ' + eventDate.getDate() + '<th></th</tr>';
                content += '<tr><td>' + time + '</td><td>' + event.summary + '</td></tr>';

              }            
              prevDay = day;
            }
          } else {
            appendPre('No upcoming events found.');
          }
          content += "</table>";
          //content += "<br>" + d.toString();
          document.getElementById('content').innerHTML = content;
          //appendPre(content);
        });
      }    