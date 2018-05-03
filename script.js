////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

var screenWidth = $(window).innerWidth(), 
	mobileScreen = (screenWidth > 500 ? false : true);

var margin = {left: 0, top: 0, right: 0, bottom: 0},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.95,
	opacityDefault = 0.7, //default opacity of chords
	opacityLow = 0.02; //hover opacity of those chords not hovered over
	
//How many pixels should the two halves be pulled apart
var pullOutSize = (mobileScreen? 20 : 50)

//////////////////////////////////////////////////////
//////////////////// Titles on top ///////////////////
//////////////////////////////////////////////////////

var titleWrapper = svg.append("g").attr("class", "chordTitleWrapper"),
	titleOffset = mobileScreen ? 15 : 40,
	titleSeparate = mobileScreen ? 30 : 0;

//Title	top left
titleWrapper.append("text")
	.attr("class","title left")
	.style("font-size", mobileScreen ? "12px" : "16px" )
	.attr("x", (width/2 + margin.left - outerRadius - titleSeparate))
	.attr("y", titleOffset)
	.text("Skill");
titleWrapper.append("line")
	.attr("class","titleLine left")
	.attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6)
	.attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4)
	.attr("y1", titleOffset+8)
	.attr("y2", titleOffset+8);
//Title top right
titleWrapper.append("text")
	.attr("class","title right")
	.style("font-size", mobileScreen ? "12px" : "16px" )
	.attr("x", (width/2 + margin.left + outerRadius + titleSeparate))
	.attr("y", titleOffset)
	.text("Member");
titleWrapper.append("line")
	.attr("class","titleLine right")
	.attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6 + 2*(outerRadius + titleSeparate))
	.attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4 + 2*(outerRadius + titleSeparate))
	.attr("y1", titleOffset+8)
	.attr("y2", titleOffset+8);
	
////////////////////////////////////////////////////////////
/////////////////// Animated gradient //////////////////////
////////////////////////////////////////////////////////////

var defs = wrapper.append("defs");
var linearGradient = defs.append("linearGradient")
	.attr("id","animatedGradient")
	.attr("x1","0%")
	.attr("y1","0%")
	.attr("x2","100%")
	.attr("y2","0")
	.attr("spreadMethod", "reflect");

linearGradient.append("animate")
	.attr("attributeName","x1")
	.attr("values","0%;100%")
//	.attr("from","0%")
//	.attr("to","100%")
	.attr("dur","7s")
	.attr("repeatCount","indefinite");

linearGradient.append("animate")
	.attr("attributeName","x2")
	.attr("values","100%;200%")
//	.attr("from","100%")
//	.attr("to","200%")
	.attr("dur","7s")
	.attr("repeatCount","indefinite");

linearGradient.append("stop")
	.attr("offset","5%")
	.attr("stop-color","#E8E8E8");
linearGradient.append("stop")
	.attr("offset","45%")
	.attr("stop-color","#A3A3A3");
linearGradient.append("stop")
	.attr("offset","55%")
	.attr("stop-color","#A3A3A3");
linearGradient.append("stop")
	.attr("offset","95%")
	.attr("stop-color","#E8E8E8");
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["Fasheen Ahmed","Dharma Karri","Prabhuraj Anbumani","Naresh Kondem","Suma Potluri",
			"Vamsi Pindi","Abdul Basith","Tapan Jain","Sandeep Kodela",
			"Girish Jeshtavani","Umeh Sufiyan","Ricardo Dominguez", "Bhuvana Natarajan", "",
			"Others","SAP Xcelcius","Tableau","SQL","SAP Web Intelligence","SAP BO Universe","SAP Crystal Reports",""];

var respondents = 254, //Total number of respondents (i.e. the number that make up the total group
	emptyPerc = 0.5, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc); 
var matrix = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,3,3,3,3,0], //Fasheen
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,3,3,0], //Dharma
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,2,3,2,2,0], //Prabhuraj
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,2,3,2,2,0], //Naresh
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,2,2,0,2,0], //Suma
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,2,2,0,2,0], //Vamsi
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,2,2,0,1,0], //Abdul
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,2,1,0,0,0], //Tapan
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,2,1,0,0,0], //Sandeep
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,2,1,0,0,0], //Girish
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,1,0,0,0], //Umeh
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,3,3,0,2,0], //Ricardo
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,2,3,3,3,3,0], //Bhuvana
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke], //dummyBottom
	[1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0], //Others
	[0,2,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0], //SAP Xcelcius
	[2,2,2,2,2,1,1,1,1,1,1,0,2,2,0,0,0,0,0,0,0,0], //Tableau
	[3,3,2,2,2,2,2,2,2,2,2,3,3,0,0,0,0,0,0,0,0,0], //SQL
	[3,3,3,3,2,2,2,1,1,1,1,3,3,0,0,0,0,0,0,0,0,0], //SAP WebIntelligence
	[3,3,2,2,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0], //SAP Business Objects
	[3,3,2,2,2,2,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0], //SAP Crystal Reports
	[0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0] //dummyTop
];
//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
//invisible chord center vertically
var offset = (2.8 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;

//Custom sort function of the chords to keep them in the original order
var chord = customChordLayout() //d3.layout.chord()
	.padding(.02)
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
	.endAngle(endAngle);

var path = stretchedChord() //Call the stretched chord function 
	.radius(innerRadius)
	.startAngle(startAngle)
	.endAngle(endAngle)
	.pullOutSize(pullOutSize);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(opacityLow))
	.on("mouseout", fade(opacityDefault));

g.append("path")
	.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
	.style("fill", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
	.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
	.attr("d", arc)
	.attr("transform", function(d, i) { //Pull the two slices apart
				d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
				return "translate(" + d.pullOutSize + ',' + 0 + ")";
	});

////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//The text also needs to be displaced in the horizontal directions
//And also rotated with the offset in the clockwise direction
g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.style("font-size", mobileScreen ? "8px" : "10px" )
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 20 + ",0)"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
  .text(function(d,i) { return Names[i]; })
  .call(wrapChord, 100);

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	.style("fill", "url(#animatedGradient)") //An SVG Gradient to give the impression of a flow from left to right
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
	.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
	.attr("d", path)
	.on("mouseover", fadeOnChord)
	.on("mouseout", fade(opacityDefault));	

////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
	wrapper.selectAll("path.chord")
		.filter(function(d) { return d.source.index !== i && d.target.index !== i && Names[d.source.index] !== ""; })
		.transition()
		.style("opacity", opacity);
  };
}//fade

// Fade function when hovering over chord
function fadeOnChord(d) {
	var chosen = d;
	wrapper.selectAll("path.chord")
		.transition()
		.style("opacity", function(d) {
			return d.source.index === chosen.source.index && d.target.index === chosen.target.index ? opacityDefault : opacityLow;
		});
}//fadeOnChord

/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrapChord(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = 0,
		x = 0,
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrapChord