

/* MILES DRIVEN chart */
var milesDrivenContainerWidth = $("#miles-driven-chart").width(),
    milesDrivenContainerHeight = $("#miles-driven-viz").height();

var margin = {top: 10, right: 60, bottom: 60, left: 60},
    milesDrivenWidth = 
        milesDrivenContainerWidth - margin.left - margin.right,
    milesDrivenHeight = 
        (milesDrivenContainerHeight * .7) - margin.top - margin.bottom;

var maxDays = 153, maxMiles = 13000,
    lineWidth = milesDrivenWidth / maxDays;

var x = d3.scale.linear()
    .domain([0, maxDays])
    .range([0, milesDrivenWidth]);

var y = d3.scale.linear()
    .domain([0, maxMiles])
    .range([milesDrivenHeight, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#miles-driven-chart").append("svg")
        .attr("width", milesDrivenWidth + margin.left + margin.right)
        .attr("height", milesDrivenHeight + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + 
            margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + milesDrivenHeight + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

function drawChart(data) {
    var totalTooltip = d3.select("body")
        .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .attr("class", "total-miles-tooltip")
            .text(function(d) {return "";});
    
    var byDayTooltip = d3.select("body")
        .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .attr("class", "miles-driven-tooltip")
            .text(function(d) {return "";});

    var total_bars = svg.selectAll("rect.total-miles")
        .data(data.driving)
            .enter()
        .append("rect")
            .attr("x", function(d) {return x(d.day) - lineWidth;})
            .attr("y", function(d) {return milesDrivenHeight;})
            .attr("width",lineWidth)
            .attr("class", "total-miles")
            .attr("height", function(d) {return 0;})
            .attr("title", function(d) {return d.date;})
            .style("stroke","#fff")
            .style("fill","#F9A31A")
            .on("mouseover", function(d, i) {
                var tipMsg = "Day " + d.day + ": " + d.total + " total miles driven";
                return totalTooltip.style("visibility", "visible")
                    .text(tipMsg);
            })
            .on("mousemove", function(d, i) {
                return totalTooltip.style("top", 
                    (event.pageY-10)+"px").style("left",
                    (event.pageX+10)+"px");
            })
            .on("mouseout", function(d, i) {
                return totalTooltip.style("visibility", "hidden");
            })
        .transition()
            .attr("y", function(d) {return y(d.total);})
            .attr("height", function(d) {
                    return milesDrivenHeight - y(d.total);
                })
            .delay(function(d, i) {return (i * 40) + 100;})
            .duration(1200);

    var bars = svg.selectAll("rect.daily-miles")
        .data(data.driving)
            .enter()
        .append("rect")
            .attr("x", function(d) {return x(d.day) - lineWidth;})
            .attr("y", function(d) {return milesDrivenHeight;})
            .attr("class", "daily-miles")
            .attr("width",lineWidth)
            .attr("height", function(d) {return 0;})
            .style("stroke","#fff")
            .style("fill","#406BB4")
            .on("mouseover", function(d, i) {
                var tipMsg = "Day " + d.day + ": " + d.miles + " daily miles";
                return byDayTooltip.style("visibility", "visible")
                    .text(tipMsg);
            })
            .on("mousemove", function(d, i) {
                return byDayTooltip.style("top", 
                    (event.pageY-10)+"px").style("left",
                    (event.pageX+10)+"px");
            })
            .on("mouseout", function(d, i) {
                return byDayTooltip.style("visibility", "hidden");
            })
        .transition()
            .attr("y", function(d) {return y(d.miles);})
            .attr("height", function(d) {
                    return milesDrivenHeight - y(d.miles);
                })
            .delay(function(d, i) {return (i * 50) + 100;})
            .duration(1200);

}


/* Organizations chart */
var organizationsContainerWidth = $("#org-svg").width(),
    organizationsContainerHeight = $("#organizations").height();

var orgMargins = {top: 0, right: 60, bottom: 10, left: 60},
    orgWidth = 
        milesDrivenContainerWidth - orgMargins.left - orgMargins.right,
    orgHeight = 
        (milesDrivenContainerHeight * .75) - orgMargins.top - 
        orgMargins.bottom;

function drawOrganizationsChart(root) {
    var radius = Math.min(orgWidth, orgHeight) / 2,
        color = d3.scale.category20c();

    var orgSvg = d3.select("#org-svg").append("svg")
        .attr("width", orgWidth)
        .attr("height", orgHeight + 100)
      .append("g")
        .attr("transform", 
            "translate(" + orgWidth / 2 + "," + orgHeight * .52 + ")");

    var partition = d3.layout.partition()
        .sort(null)
        .size([2 * Math.PI, radius * radius])
        .value(function(d) { return 1; });
    
    var arcStart = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return 180; })
        .outerRadius(function(d) { return 180; });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    // Stash the old values for transition.
    function stash(d) {
      d.x0 = d.x;
      d.dx0 = d.dx;
    }

    // Interpolate the arcs in data space.
    function arcTween(a) {
      var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
      return function(t) {
        var b = i(t);
        a.x0 = b.x;
        a.dx0 = b.dx;
        return arc(b);
      };
    }
    
    var storyTooltip = d3.select("body")
        .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .attr("class", "story-tooltip")
            .text(function(d) {return "";});
    

    var path = orgSvg.datum(root).selectAll("path")
        .data(partition.nodes)
    .enter().append("svg:a")
            .attr("xlink:href", function(d, i) {return d.link;})
        .append("path")
        // hide inner ring
        .attr("d", arcStart)
        .attr("display", function(d) { 
            return d.depth ? null : "none"; 
        })
        .on("mouseover", function(d, i) {
            var tipMsg = d.name;
            return storyTooltip.style("visibility", "visible")
                .text(tipMsg);
        })
        .on("mousemove", function(d, i) {
            return storyTooltip.style("top", 
                (event.pageY-10)+"px").style("left",
                (event.pageX+10)+"px");
        })
        .on("mouseout", function(d, i) {
            return storyTooltip.style("visibility", "hidden");
        })
        .style("stroke", "#222")
        .style("fill", "#222")
            .each(stash)
        .transition()
            .delay(250)
            .duration(2750)
        .style("fill", function(d) { 
            return color((d.children ? d : d.parent).name); 
         })
        .style("stroke", "#eee")
        .style("fill-rule", "evenodd")
        .attr("d", arc);

    d3.select(self.frameElement).style("height", orgHeight + "px");

}


/* leaflet map */
function drawCitiesMap() {
    var contactContainerWidth = $("#contact").width();
        contactContainerHeight = $("#contact").height();

    $("#matt-makai-image").width(contactContainerWidth/3);

    var mapContainerWidth = $("#map").width(),
        mapContainerHeight = $("#map").height();

    var mapMargin = {top: 10, right: 60, bottom: 60, left: 0},
        mapWidth =
            mapContainerWidth - mapMargin.left - mapMargin.right,
        mapHeight =
            (mapContainerHeight * .7) - mapMargin.top - mapMargin.bottom;

    $("#map-container").height(mapHeight);
    
    var map = L.map('map-container', {'minZoom': 4}).setView([37.8, -96], 4);

    var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
        key: 'BC9A493B41014CAABB98F0471D759707',
        styleId: 22677
    }).addTo(map);


    // control that shows state info on hover
    var info = L.control();


    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: '#666',
            dashArray: '3',
            fillOpacity: 0.7,
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#222',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        //info.update(layer.feature.properties);
    }

    var geojson;

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        //info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    
    L.marker(new L.LatLng(38.95,-77.04)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/washington-dc.html">Washington, DC</a><br/>Depart March 9, return August 9, 2013</span><br/><a href="/tim-oreilly-open-government.html">Tim O\'Reilly on Open Government</a><br/><a href="/human-geo-washington-dc.html">HumanGeo</a><br/><a href="/wisertogether-washington-dc.html">WiserTogether</a><br/><a href="/uppidy-washington-dc.html">Uppidy</a><br/><br/><span class="external-resources">External Resources</span><br/><a href="http://proudlymadeindc.com/">Proudly Made in DC</a><br/><a href="http://www.fosterly.com/">Fosterly</a>').openPopup();

    L.marker(new L.LatLng(38.13,-78.45)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/charlottesville-va.html">Charlottesville, VA</a><br/>March 9-13, 2013</span><br/><a href="/day-one-coding-across-america.html">Day One</a><br/><a href="/charlottesville-virginia-day-one-through-five.html">Charlottesville Pictures</a><br/><a href="/agilityfeat-charlottesville-va.html">AgilityFeat</a><br/><a href="/willowtree-apps-charlottesville-va.html">WillowTree Apps</a>');

    L.marker(new L.LatLng(35.22,-80.93)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/charlotte-nc.html">Charlotte, NC</a><br/>March 13-17, 2013</span><br/><a href="/hey-pycon.html">Hey PyCon!</a>');

    L.marker(new L.LatLng(29.98,-90.25)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/new-orleans-la.html">New Orleans, LA</a><br/>March 17-24, 2013</span><br/><a href="/new-orleans-entrepreneurship-week.html">NOEW 2013</a><br/><a href="/walter-isaacson-diversity-nutures-entrepreneurship.html">Walter Isaacson: Diversity Nutures Entrepreneurship</a><br/><a href="/noew-4pt0-schools-companies-pitches.html">NOEW 4.0 Schools Companies\' Pitches</a><br/><a href="/4pt0schools-coder-couch-nola">4.0 Schools\' Coder Couch</a><br/><a href="/noew-ideacorps-pitch-challenge.html">IDEAcorps Pitch Challenge</a><br/><a href="/how-to-plug-into-growing-new-orleans-entrepreneurship-scene.html">Plug In to NOLA\s Growing Entrepreneurship Scene</a><br/><span class="future-stories">mSchool<br/>Enriched Schools</span><br/><br/><span class="external-resources">External Resources</span><br/><a href="http://siliconbayounews.com/">Silicon Bayou News</a></span>');
    
    L.marker(new L.LatLng(35.05, -90.00)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/memphis-tn.html">Memphis, TN</a><br/>March 24-28, 2013</span><br/><a href="/memphis-tennessee-pictures.html">Memphis Pictures</a><br/><a href="/memphis-mempy-talk.html">MemPy</a><br/><span class="future-stories">Seed Hatchery<br/>Work for Pie<br/>Launch Memphis<br/></span><br/><span class="external-resources">External Resources</span><br/><a href="http://www.nibletz.com/">Nibletz</a><br/><a href="http://www.launchmemphis.com/">Launch Memphis</a><br/><a href="http://southernalpha.com/">Southern Alpha</a>');
    
    L.marker(new L.LatLng(32.73, -96.97)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/dallas-tx.html">Dallas, TX</a><br/>March 28-April 1, 2013</span><br/><a href="/gravity-center-dallas-tx.html">The Gravity Center</a><br/><span class="future-stories">Startup Texas<br/>Tech Wildcatters<br/>The Common Desk<br/>SocialGlimpz</span>');
    
    L.marker(new L.LatLng(30.30, -97.70)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/austin-tx.html">Austin, TX</a><br/>April 1-7, 2013</span><br/><a href="/capital-factory-austin-tx.html">Capital Factory</a><br/><a href="starting-sustaining-book.html">Doers Help Doers</a><br/><span class="future-stories">Continuum Analytics<br/>CopperEgg</span>');

    L.marker(new L.LatLng(33.65, -101.82)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/lubbock-tx.html">Lubbock, TX</a><br/>April 7-10, 2013</span><br/><a href="/month-meeting-startups.html">A Month of Meeting Startups</a><br/>');
    
    L.marker(new L.LatLng(35.88, -106.28)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/los-alamos-nm.html">Los Alamos, NM</a><br/>April 10-12, 2013</span><br/><a href="/los-alamos-new-mexico-is-beautiful.html">Los Alamos is Beautiful</a><br/><a href="/why-hell-you-in-small-city.html">Why the Hell Are You in [Small City]?</a>');
    
    L.marker(new L.LatLng(38.77, -109.75)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/moab-ut.html">Moab, UT</a><br/>April 12-14, 2013</span><br/><a href="/moab-scenery.html">Moab Scenery</a>');
    
    L.marker(new L.LatLng(33.43, -112.02)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/phoenix-az.html">Phoenix, AZ</a><br/>April 14-18, 2013</span><br/><a href="/startup-america-artwork.html">Startup America Artwork</a><br/><a href="/seed-spot-phoenix-az.html">Seed Spot</a><br/><a href="/co-hoots-phoenix-az.html">CO+HOOTS</a><br/><a href="/misto-box-phoenix-az.html">MistoBox</a><br/><span class="future-stories">Startup America Regional Summit Thoughts</span>');
   
    L.marker(new L.LatLng(32.73, -117.17)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/san-diego-ca.html">San Diego, CA</a><br/>April 18-28, 2013</span><br/><a href="/antengo-san-diego-ca.html">Antengo</a><br/><a href="/evonexus-san-diego-ca.html">EvoNexus</a><br/><a href="/forwardmetrics-san-diego-ca.html">ForwardMetrics</a><br/><a href="/san-diego-scenery.html">San Diego Scenery</a><br/><span class="future-stories">Nulu<br/>Saambaa</span>');
    
    L.marker(new L.LatLng(36.08, -115.17)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/las-vegas-nv.html">Las Vegas, NV</a><br/>April 28-May 1, 2013</span><br/><a href="/microconf-2013-las-vegas.html">Microconf 2013</a><br/><a href="/las-vegas-nevada-pictures.html">Las Vegas Pictures</a><br/><span class="future-stories">Microconf Thoughts</span>');
    
    L.marker(new L.LatLng(33.93, -118.40)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/los-angeles-ca.html">Los Angeles, CA</a><br/>May 1-9, 2013</span><br/><br/><span class="external-resources">External Resources</span><br/><a href="http://www.builtinla.com/" target="_blank">Built in LA</a><br/>');
    
    L.marker(new L.LatLng(37.62, -122.38)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/san-francisco-ca.html">San Francisco &amp; San Jose, CA</a><br/>May 9-17, 2013</span><br/><a href="/computer-history-museum-mountain-view-ca.html">Computer History Museum</a><br/><span class="future-stories">Twilio<br/>Code for America<br/>Banjo<br/></span>');
    
    L.marker(new L.LatLng(44.12, -123.22)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/eugene-or.html">Eugene, OR</a><br/>May 17-21, 2013</span><br/><a href="/eugene-oregon-pictures.html">Eugene Pictures</a><br/><span class="future-stories">Palo Alto Software<br/>Concentric Sky</span><br/><br/><span class="external-resources">External Resources</span><br/><a href="http://siliconshire.org/">Silicon Shire</a>');
    
    L.marker(new L.LatLng(45.60, -122.60)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/portland-or.html">Portland, OR</a><br/>May 21-29, 2013</span><br/><a href="/portland-oregon-pictures.html">Portland Pictures</a><br/><br/><span class="external-resources">External Resources</span><br/><a href="http://www.oregonlive.com/silicon-forest/">Silicon Forest News</a>');
    
    L.marker(new L.LatLng(47.45, -122.30)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/seattle-wa.html">Seattle, WA</a><br/>May 29-June 6, 2013</span><br/><a href="/seattle-city-pictures.html">Seattle City Pictures</a><br/><a href="/seattle-hiking-pictures.html">Seattle Hiking Pictures</a><br/><a href="/university-of-washington-pictures.html">University of Washington Pictures</a><br/><span class="future-stories">Socrata<br/>Factor.io<br/>Maker Space</span>');
    
    L.marker(new L.LatLng(46.92, -114.08)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/missoula-mt.html">Missoula, MT</a><br/>June 6-9, 2013</span><br/><a href="/montana-pictures.html">Montana Pictures</a>');
    
    L.marker(new L.LatLng(44.35, -106.70)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/buffalo-wy.html">Buffalo, WY</a><br/>June 9-12, 2013</span><br/><a href="/wyoming-photography.html">Wyoming Pictures</a>');
    
    L.marker(new L.LatLng(40.02, -105.27)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/boulder-co.html">Boulder, CO</a><br/>June 12-19, 2013</span><br/><a href="/colorado-hiking-pictures.html">Colorado Hiking Pictures</a>');
    
    L.marker(new L.LatLng(41.58, -93.71)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/des-moines-ia.html">Des Moines, IA</a><br/>June 19-25, 27-July 8, 2013</span><br/><span class="future-stories">Silicon Prairie News<br/>Dwolla<br/>StartupCity Des Moines<br/>Pongr<br/>BitMethod<br/>Hatchlings<br/></span>');
    
    L.marker(new L.LatLng(39.10, -94.58)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/kansas-city-mo.html">Kansas City, MO</a><br/>June 25-27, 2013</span><br/><span class="future-stories">Kaufmann Foundation<br/>KCSourceLink<br/>Entrepreneur KC Radio<br/>SightDeckKC<br/>Leap2<br/>Hacker Village<br/>EyeVerify<br/>One Million Cups KC<br/></span>');
    
    L.marker(new L.LatLng(41.26, -95.94)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/omaha-ne.html">Omaha, NE</a><br/>July 1-2, 2013</span><br/><span class="future-stories">Omaha Python<br/>Startup Genome</span><br/><br/><span class="external-resources">External Resources</span><br/><a href="http://techomaha.com/">Tech Omaha</a><br/><a href="http://www.siliconprairienews.com/">Silicon Prairie News</a><br/><a href="http://jamesharr.github.io/omg-code/">OMG!Code</a></span>');
    
    L.marker(new L.LatLng(43.07, -89.40)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/madison-wi.html">Madison, WI</a><br/>July 8-14, 2013</span><br/><span class="future-stories">Drifty</span>');
    
    L.marker(new L.LatLng(41.85, -87.65)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/chicago-il.html">Chicago, IL</a><br/>July 14-21, 2013</span><br/><a href="/chicago-pictures.html">Chicago Pictures</a><br/><span class="future-stories">1871<br/>The Starter League<br/>Matchist<br/><br/><span class="external-resources">External Resources</span><br/><a href="http://techweek.com/chicago/">Techweek Chicago</a><br/><a href="http://startupdigest.com/chicago/">StartupDigest Chicago</a></br><a href="http://technori.com/" target="_blank">Technori</a><br/><a href="http://www.builtinchicago.org/" target="_blank">Built in Chicago</a><br/>');
    
    L.marker(new L.LatLng(42.33, -83.05)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/detroit-mi.html">Detroit, MI</a><br/>July 21-26, 2013</span>');
    
    L.marker(new L.LatLng(42.89, -78.88)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/buffalo-ny.html">Buffalo, NY</a><br/>July 26-29, 2013</span>');

    L.marker(new L.LatLng(42.36, -71.06)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/boston-ma.html">Boston, MA</a><br/>July 29-August 3, 2013</span>');

    L.marker(new L.LatLng(40.71, -74.01)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/new-york-ny.html">New York, NY</a><br/>August 3-7, 2013</span>');

    L.marker(new L.LatLng(40.80, -74.48)).addTo(map)
        .bindPopup('<span class="city-name"><a href="/morristown-nj.html">Morristown, NJ</a><br/>August 7-9, 2013</span>');

}







/* backstretch jquery */
/*! Backstretch - v2.0.3 - 2012-11-30
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2012 Scott Robbin; Licensed MIT */
(function(e,t,n){"use strict";e.fn.backstretch=function(r,s){return(r===n||r.length===0)&&e.error("No images were supplied for Backstretch"),e(t).scrollTop()===0&&t.scrollTo(0,0),this.each(function(){var t=e(this),n=t.data("backstretch");n&&(s=e.extend(n.options,s),n.destroy(!0)),n=new i(this,r,s),t.data("backstretch",n)})},e.backstretch=function(t,n){return e("body").backstretch(t,n).data("backstretch")},e.expr[":"].backstretch=function(t){return e(t).data("backstretch")!==n},e.fn.backstretch.defaults={centeredX:!0,centeredY:!0,duration:5e3,fade:0};var r={wrap:{left:0,top:0,overflow:"hidden",margin:0,padding:0,height:"100%",width:"100%",zIndex:-999999},img:{position:"absolute",display:"none",margin:0,padding:0,border:"none",width:"auto",height:"auto",maxWidth:"none",zIndex:-999999}},i=function(n,i,o){this.options=e.extend({},e.fn.backstretch.defaults,o||{}),this.images=e.isArray(i)?i:[i],e.each(this.images,function(){e("<img />")[0].src=this}),this.isBody=n===document.body,this.$container=e(n),this.$wrap=e('<div class="backstretch"></div>').css(r.wrap).appendTo(this.$container),this.$root=this.isBody?s?e(t):e(document):this.$container;if(!this.isBody){var u=this.$container.css("position"),a=this.$container.css("zIndex");this.$container.css({position:u==="static"?"relative":u,zIndex:a==="auto"?0:a,background:"none"}),this.$wrap.css({zIndex:-999998})}this.$wrap.css({position:this.isBody&&s?"fixed":"absolute"}),this.index=0,this.show(this.index),e(t).on("resize.backstretch",e.proxy(this.resize,this)).on("orientationchange.backstretch",e.proxy(function(){this.isBody&&t.pageYOffset===0&&(t.scrollTo(0,1),this.resize())},this))};i.prototype={resize:function(){try{var e={left:0,top:0},n=this.isBody?this.$root.width():this.$root.innerWidth(),r=n,i=this.isBody?t.innerHeight?t.innerHeight:this.$root.height():this.$root.innerHeight(),s=r/this.$img.data("ratio"),o;s>=i?(o=(s-i)/2,this.options.centeredY&&(e.top="-"+o+"px")):(s=i,r=s*this.$img.data("ratio"),o=(r-n)/2,this.options.centeredX&&(e.left="-"+o+"px")),this.$wrap.css({width:n,height:i}).find("img:not(.deleteable)").css({width:r,height:s}).css(e)}catch(u){}return this},show:function(t){if(Math.abs(t)>this.images.length-1)return;this.index=t;var n=this,i=n.$wrap.find("img").addClass("deleteable"),s=e.Event("backstretch.show",{relatedTarget:n.$container[0]});return clearInterval(n.interval),n.$img=e("<img />").css(r.img).bind("load",function(t){var r=this.width||e(t.target).width(),o=this.height||e(t.target).height();e(this).data("ratio",r/o),e(this).fadeIn(n.options.speed||n.options.fade,function(){i.remove(),n.paused||n.cycle(),n.$container.trigger(s,n)}),n.resize()}).appendTo(n.$wrap),n.$img.attr("src",n.images[t]),n},next:function(){return this.show(this.index<this.images.length-1?this.index+1:0)},prev:function(){return this.show(this.index===0?this.images.length-1:this.index-1)},pause:function(){return this.paused=!0,this},resume:function(){return this.paused=!1,this.next(),this},cycle:function(){return this.images.length>1&&(clearInterval(this.interval),this.interval=setInterval(e.proxy(function(){this.paused||this.next()},this),this.options.duration)),this},destroy:function(n){e(t).off("resize.backstretch orientationchange.backstretch"),clearInterval(this.interval),n||this.$wrap.remove(),this.$container.removeData("backstretch")}};var s=function(){var e=navigator.userAgent,n=navigator.platform,r=e.match(/AppleWebKit\/([0-9]+)/),i=!!r&&r[1],s=e.match(/Fennec\/([0-9]+)/),o=!!s&&s[1],u=e.match(/Opera Mobi\/([0-9]+)/),a=!!u&&u[1],f=e.match(/MSIE ([0-9]+)/),l=!!f&&f[1];return!((n.indexOf("iPhone")>-1||n.indexOf("iPad")>-1||n.indexOf("iPod")>-1)&&i&&i<534||t.operamini&&{}.toString.call(t.operamini)==="[object OperaMini]"||u&&a<7458||e.indexOf("Android")>-1&&i&&i<533||o&&o<6||"palmGetResource"in t&&i&&i<534||e.indexOf("MeeGo")>-1&&e.indexOf("NokiaBrowser/8.5.0")>-1||l&&l<=6)}()})(jQuery,window);
