d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

var w = document.getElementById("paris").offsetWidth
echelle = w * 450
h = w * .8
m = d3.map(data, function(d, i) {
    if (d != undefined) return d[1];
});

mobile = false;

/* Projection conique conforme de Lambert, « Lambert 93 » */
var projection = d3.geoConicEquidistant()
    .scale(echelle)
    .precision(.1)
    .rotate([-3, 0])
    .translate([w / 2, h / 2])
    .center([-.66, 48.856614])
    .parallels([44, 49]);

var path = d3.geoPath()
    .projection(projection);

// TODO: svg:svg
var svg = d3.select("#pariscarte").insert("svg:svg")
    .attr("width", "100%")
    .attr("viewBox", "0 0 " + w + " " + h)

g = svg.append("g")
    .attr("class", "bureaux")

limites = svg.append("g")
    .attr("class", "limites")

arrondissement = svg.append("svg:g")
    .attr("id", "arrondissements");

d3.json("data/paris_bv.json", function(error, fra) {
    if (error) throw error;
    
    g.selectAll("path")
	.data(topojson.feature(fra, fra.objects.paris).features)
	.enter().append("path")
	.attr("d", path)
	.attr("class", "bv")
	.attr("id", function(d, i) {
	    return "c" + d.properties.id
	})
	.attr("fill", colorer)
	.attr("stroke", colorer)
	.attr("stroke-width", 1)
	.on("mouseover", function() {
	    d3.select(this).moveToFront()
		.attr("fill", function() {
		    return d3.rgb(d3.select(this).attr("fill")).darker(1)
		})
	})
	.on("mouseout", function() {
	    d3.select(this).moveToBack()
		.attr("fill", colorer)
	});
});

/* le contour des arrondissements */
d3.json('data/contour.json', function(contour){
    arrondissement.selectAll("path")
	.data(contour.features)
	.enter().append("path")
	.attr("d", path)
	.attr("class", "contours");
})

/* on recolore */
function recolorer(d) {
    
    var a = dico[d].steps
    b = dico[d].steps.slice(1, -1)

    color = dico[d].color,
        quantize = d3.scaleThreshold()
        .domain(b)
        .range(d3.range(Number(a.length) - 1).map(function(i) {
            return color[i]
        }));

    g.selectAll("path.bv")
        .each(function(e, j) {
            d3.select("#c" + e.properties.id).transition().duration(500)
                .attr("fill", function(f) {
                    return quantize(m.get(f.properties.id)[dico[d].number] / m.get(f.properties.id)[7] * 100)
                })
                .attr("stroke", function(f) {
                    return quantize(m.get(f.properties.id)[dico[d].number] / m.get(f.properties.id)[7] * 100)
                })
        })
        .on("mouseover", function() {
            d3.select(this).moveToFront()
                .attr("fill", function() {
                    return d3.rgb(d3.select(this).attr("fill")).darker(1)
                })
        })
        .on("mouseout", function() {
            d3.select(this).moveToBack()
                .attr("fill", function() {
                    return d3.rgb(d3.select(this).attr("fill")).brighter(1)
                })
        });
//       geneLegende(d)
}


function colorer(d) {
    var tableau = m.get(d.properties.id)
    if (tableau != undefined) {
        tableau = tableau.slice(8)
        var max = Math.max.apply(Math, tableau)
        var lequel = data[0][tableau.indexOf(max) + 8]
        return dico[lequel].couleur
    }
};


/* on revient à la couleur de base*/
function debase(d) {
    g.selectAll("path.bv")
        .each(function(e, j) {
            d3.select("#c" + e.properties.id).transition().duration(500)
                .attr("fill", colorer)
                .attr("stroke", colorer)
                .attr("fill-opacity", 1);
        })
        .on("mouseover", function() {
            d3.select(this).moveToFront()
                .attr("fill", function() {
                    return d3.rgb(d3.select(this).attr("fill")).darker(1)
                })
        })
        .on("mouseout", function() {
            d3.select(this).moveToBack()
                .attr("fill", colorer)
        });
    geneLegende(d)

}


function geneLegende(d) {
    $("#paris .legende").empty()
    malegende = "";
    if (d != undefined) {
        for (i = 0; i <= dico[d].steps.length - 2; i++) {
            malegende += "<div class=\"unecouleur\">"
            malegende += "<span class=\"bulle\" style=\"background-color:" + dico[d].color[i] + ";\"></span>"
            malegende += String(dico[d].steps[i]).replace(".", ",")
            if (i != dico[d].steps.length - 2) malegende += " à "
            malegende += String(dico[d].steps[i + 1]).replace("100", "").replace(".", ",") + "&nbsp;" + ((i == dico[d].steps.length - 2) ? "% et +" : "%")
            malegende += "</div>"
        };
    }
    $("#paris .legende").html(malegende)

}


$("#quidonc").on("change", function(d) {
        var qui = $(this).val();
        if (qui == "entete") debase()
        else recolorer(qui)
    })
