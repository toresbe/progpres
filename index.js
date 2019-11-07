var todays_schedule = [];
var table = document.getElementById("schedule");

const delay = ms => new Promise(res => setTimeout(res, ms));

function update() {
    console.log('asked to update');
}

function play() {
    do_play();
}

function stop() {
    console.log('bye');
    document.getElementById("container").classList.remove("visible");
}

async function do_play() {
    document.getElementById("container").classList.add("visible");
    await delay(500);
    var num_pages = Math.ceil(todays_schedule.length/5);
    var entries_per_page = 5;
    for (i = 0; i < num_pages; i++) {
        console.log(i);
        await display_entries(i * entries_per_page, entries_per_page);
        await delay(5000);
        await hide_entries();
        await delay(1000);
    }
};

async function hide_entries() {
    var divs = document.querySelectorAll('.programme.show');
    for (let div of divs) {
        div.classList.remove('show');
    }
    await delay(500);
    for (let div of divs) {
        div.style.display = 'none';
    }
}

async function display_entries (start, num) {
    var divs = document.querySelectorAll('.programme');
    if(divs.length < (start+num)) {
        num = divs.length - start;
    }
    await delay(100);
    for (var i = start; i < start + num; i++) {
        divs[i].classList.add('show');
    }
    await delay(500);
}

function render_programme(time, title) {
    var row = document.createElement("div");
    row.classList.add("programme");
    row.classList.add("programme");

    var td = document.createElement("div");
    var node = document.createTextNode(time);
    td.classList.add("programme-time");
    td.appendChild(node);
    row.appendChild(td);

    var td = document.createElement("div");
    var node = document.createTextNode(title);
    td.classList.add("programme-title");
    td.appendChild(node);
    row.appendChild(td);

    return row;
}

function build_table() {
    for(let programme of todays_schedule) {
        //console.log(programme);
        table.appendChild(render_programme(programme.time, programme.title));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://frikanalen.no/api/scheduleitems/?page_size=10000?days=1')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function(data) {
                    current_time = new Date();
                    var params = new URLSearchParams(window.location.search);
                    var duration = params.get("microseconds");
                    if(duration === null) duration = 10000000;
                    console.log('Building timeline for ' + duration + ' microseconds');
                    if(params.has("browser")) {
                        console.log('i see u');
                        document.getElementById("container").style.backgroundColor = "black";
                        document.getElementById("container").style.opacity = 1;
                    }


                    for (let result of data.results) {
                        start_time = new Date(Date.parse(result.starttime));
                        if(start_time >= current_time)  {
                            var start_time_formatted = ('0' + start_time.getHours()).slice(-2) + ":" + ('0' + start_time.getMinutes()).slice(-2);
                            //console.log(start_time_formatted);
                            todays_schedule.push({"time": start_time_formatted, "title": result.video.name});
                        }
                    }
                    build_table();
                    console.log('Timeline ready.');
                    //console.log(data);
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
});
