var CALENDAR = function () {
    var wrap, label,
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    //Initializes the Calendar
    
    
    
    function init(newWrap) {
        //assign values to label. #label holds data on month and year.
        wrap = $("#calendar");
        label = wrap.find("#label");
         //bind click events to "prev" and "next" buttons 
        wrap.find("#prev").bind("click", function () { switchMonth(false); });
        wrap.find("#next").bind("click", function () { switchMonth(true); });
        //adds functionality to return to current month by clicking on the label  
        label.bind("click", function () { switchMonth(null, new Date().getMonth(), new Date().getFullYear()); });
        label.click();
	}

    //Switches between the months
   
   
    
    function switchMonth(next, month, year) {
         //splits the label into an array called curr
        var curr = label.text().trim().split(" "), calendar, tempYear = parseInt(curr[1], 10);
         //cycles through the var month to determine month upon switching
        if (!month) { 
            if (next) { 
                if (curr[0] === "December") { 
                    month = 0; 
                } else { 
                    month = months.indexOf(curr[0]) + 1; 
                } 
            } else { 
                if (curr[0] === "January") { 
                    month = 11; 
                } else { 
                    month = months.indexOf(curr[0]) - 1; 
                } 
            } 
        }
        //cycles through years by adding/subtratcting 1
        if (!year) { 
            if (next && month === 0) { 
                year = tempYear + 1; 
            } else if (!next && month === 11) { 
                year = tempYear - 1; 
            } else { 
                year = tempYear; 
            } 
        }

        //Creates Calendar
        calendar = createCal(year, month);
        //jQuery the #frame and apply the wrap onto it.
        $("#frame", wrap)
        //removes the current calendar information, pops the stack, and adds a new calendar.
        .find(".curr").remove().end().prepend(calendar.calendar());
        //jQuery creates new label information for new calendar.
        $('#label').text(calendar.label);
        //searches current calendar and creates event listeners in every td that isn't a null.
        wrap.find(".curr td").not(".nil").click(function(event) { getDescription(event, $(this)); });
    }

    //Creates the Calendar frame
    function createCal(year, month) {
        //Leap year calculations
        var day = 1, i, j, haveDays = true,
            startDay = new Date(year, month, day).getDay(),
            daysInMonths = [31, (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            calendar = [];
        //If current year and month data is in the cache, retrieves it. Otherwise stores it in cache.
        if (createCal.cache[year]) {
            if (createCal.cache[year][month]) {
                return createCal.cache[year][month];
            }
        } else {
            createCal.cache[year] = {};
        }
        i = 0;
        //creates the days of the Calendar for the requested month
        while (haveDays) {
            calendar[i] = [];
            //i is the week. j is the day.
            for (j = 0; j < 7; j++) {
                if (i === 0) {
                    if (j === startDay) {
                        calendar[i][j] = day++;
                        startDay++;
                    }
                } else if (day <= daysInMonths[month]) {
                    calendar[i][j] = day++;
                } else {
                    calendar[i][j] = "";
                    haveDays = false;
                }
                if (day > daysInMonths[month]) {
                    haveDays = false;
                }
            }
            i++;
        }
        //concatenates each week in the calendar
        for (i = 0; i < calendar.length; i++) {
			calendar[i] = "<tr><td>" + calendar[i].join("</td><td>") + "</td></tr>";
        }
        calendar = $("<table>" + calendar.join("") + "</table>").addClass("curr");
        $("td:empty", calendar).addClass("nil");
        //finds tds in calendar that aren't nil. adds div and index to them. index represents days of the month
        $("td", calendar).not(".nil").each(function(index) { $(this).attr("id", (index+1)).empty().prepend("<div class=\"dayNumb\">" + (index+1)); });
        //If we are in the current month, find today's day and assign it the today class.
        if (month === new Date().getMonth()) {
            $('td', calendar).filter(function () { return $(this).text() === new Date().getDate().toString(); }).addClass("today");
        }
        //Create cache data of the current calendar and return it.
        createCal.cache[year][month] = { calendar: function () { return calendar.clone() }, label: months[month] + " " + year };
		return createCal.cache[year][month];

    }
    
    //Creates and initializes the cache.
    createCal.cache = {};
    return {
		init: init,
        switchMonth: switchMonth,
        createCal: createCal
	};

};

//Allows user to enter an event description and manipulate it in the table cell
function getDescription(event, context){

    //Sets a text limit for the user prompt
    var maxLength = 20;
    var eventDescription = -1;

    // Removes and event by clicking on it and checking to see if it's a userEvent
    if (event.target.className == "userEvent") {
        if (confirm("Would you like to delete this event?")) {
            $(event.target).remove();
        }
    }

    // Add event
    else {
        //prompts user for an event description
        while (eventDescription == -1 && (eventDescription != null )) {
            eventDescription = prompt("Enter a description of your event (" + maxLength + " char limit):");
            //if event description is of proper length and isn't null
            if(eventDescription != null && eventDescription.length < maxLength){
                //appends the user input into clicked table and assigns it a userEvent class
                $(context).append("<div class=\"userEvent\">" + eventDescription);
                break;
            }
            //Alerts user that their event exceeded the character limit
            else if(eventDescription != null){
                alert("Event description exceeds character limit.");
                break;
            };
        }
    } 
    
}

        
    



