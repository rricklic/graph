//TODO: viewPort sizing
//TODO: zoom in/out
//TODO: highlight values on x-axis position
function Graph(graphCanvas, width, height)
{
   var that = this;
   var graphCanvasCtx = graphCanvas.getContext("2d");
   graphCanvas.width=width;
   graphCanvas.height=height;

   var title = "Test Graph 1.0";
   var fontSize = 10;
   var margin = 20;
   var marginTop = margin;
   var marginBottom = margin;
   var marginLeft = margin;
   var marginRight = margin;
   var colors = ["#FF0000", "#00FF00", "#0000FF"]

   //TODO: if x-points are numbers, use that as value; otherwise use that index as value
   var graphPointArray = []; //From file
   var graphPoints = {
            originX:0, 
            originY:0, 
            minX:0, 
            minY:0, 
            maxX:0, 
            maxY:0 }; 

   //Converted from pointArrayInGraph
   var canvasPointArray = []; 
   //Default to quandrant I graph
   var canvasPoints = {
            originX:marginLeft, 
            originY:graphCanvas.height-marginBottom, 
            minX:marginLeft, 
            minY:graphCanvas.height-marginBottom, 
            maxX:graphCanvas.width-marginRight, 
            maxY:marginTop };

   //var viewPoints = {
   //         minX:marginLeft, 
   //         minY:graphCanvas.height-marginBottom, 
   //         maxX:graphCanvas.width-marginRight, 
   //         maxY:marginTop };
   
   function convert(canvasPoints, graphPoints, fromPoint, toPoint) {}

   //var draw = function(anArray)
   //{
   //
   //};

   //-------------------------------------------------------------------------------------------------------------
   Graph.prototype.load = function(fileContents)
   {
      parseFileContents(fileContents);
      //redraw();
      clearGraph();
      drawBorder();
      drawTitle();
      drawAxes();
      drawAxesTitles();
      drawGraph();
      drawValues();
   }

   //-------------------------------------------------------------------------------------------------------------
   //function redraw()
   Graph.prototype.redraw = function()
   {
      clearGraph();
      drawBorder();
      drawTitle();
      drawAxes();
      drawAxesTitles();
      drawGraph();
      drawValues();
   }

   //-------------------------------------------------------------------------------------------------------------
   function clearGraph()
   {
      graphCanvasCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
      graphCanvasCtx.fillStyle = "#FFFFFF";
      graphCanvasCtx.fillRect(0, 0, graphCanvas.width, graphCanvas.height);
   }

   //-------------------------------------------------------------------------------------------------------------
   Graph.prototype.setMargin = function(marginSize)
   {
      margin = parseInt(marginSize);
      marginTop = margin;
      marginBottom = margin;
      marginLeft = margin;
      marginRight = margin;

      canvasPoints = {
            originX:marginLeft, 
            originY:graphCanvas.height-marginBottom, 
            minX:marginLeft, 
            minY:graphCanvas.height-marginBottom, 
            maxX:graphCanvas.width-marginRight, 
            maxY:marginTop };

      resetLayout();
      //xDelta = graphPoints.maxX - graphPoints.originX;
      //yDelta = graphPoints.maxY - graphPoints.originY;
      //xPixels = canvasPoints.maxX - canvasPoints.originX;
      //yPixels = canvasPoints.maxY - canvasPoints.originY;
   }

   //-------------------------------------------------------------------------------------------------------------
   Graph.prototype.setCanvasSize = function(width, height)
   {
      graphCanvas.width = width;
      graphCanvas.height = height;

      canvasPoints = {
            originX:marginLeft, 
            originY:graphCanvas.height-marginBottom, 
            minX:marginLeft, 
            minY:graphCanvas.height-marginBottom, 
            maxX:graphCanvas.width-marginRight, 
            maxY:marginTop };

      resetLayout();
      //xDelta = graphPoints.maxX - graphPoints.originX;
      //yDelta = graphPoints.maxY - graphPoints.originY;
      //xPixels = canvasPoints.maxX - canvasPoints.originX;
      //yPixels = canvasPoints.maxY - canvasPoints.originY;
   }

   //-------------------------------------------------------------------------------------------------------------
   function parseFileContents(fileContents)
   {
      //Reset graph values
      graphPointArray = [];
      graphPoints = {
            originX:0, 
            originY:0, 
            minX:0, 
            minY:0, 
            maxX:0, 
            maxY:0 };

      //store in array, set min/max, calc deltas
      var lines = fileContents.split(/[\r\n]+/g);
      for(var index = 0; index < lines.length; index++)
      {
         var fields = lines[index].split(",");

         //TODO: this statement skips last line which is an empty string... do this better
         if(fields.length == 1 && fields[0] == "") { continue; }

         if(parseInt(fields[0]) < parseInt(graphPoints.minX))
         {
            graphPoints.minX = parseInt(fields[0]);
         }

         if(parseInt(fields[0]) > parseInt(graphPoints.maxX))
         {
            graphPoints.maxX = parseInt(fields[0]);
         }

         var yValueArray = [];
         for(var fieldIndex = 1; fieldIndex < fields.length; fieldIndex++)
         {
            if(parseInt(fields[fieldIndex]) < parseInt(graphPoints.minY))
            {
               graphPoints.minY = parseInt(fields[fieldIndex]);
            }

            if(parseInt(fields[fieldIndex]) > parseInt(graphPoints.maxY))
            {
               graphPoints.maxY = parseInt(fields[fieldIndex]);
            }

            yValueArray.push(fields[fieldIndex]);
         }

         //TODO: handle both index based and value based x-axis
         graphPointArray.push([parseInt(fields[0]), yValueArray]);
      }

      //TODO: graphPoints.maxX - support value to be the max; not just iterative ordering
      //graphPoints.maxX = graphPointArray.length - 1; // -1 because 0-based



      //TODO: remove
      //var tmpIndex = 20;
      //var tmpArray = [];
      //tmpArray.push("5");
      //tmpArray.push("5");
      //tmpArray.push("5");
      //graphPointArray.push([tmpIndex, tmpArray]);
      //graphPoints.maxX = 20;
      //graphPoints.maxX = 11;

      //window.alert(testArray[tmpIndex][0]);
      //window.alert(testArray[tmpIndex][1][0]);
      //window.alert(testArray[tmpIndex][1][1]);
      //window.alert(testArray[tmpIndex][1][2]);

      resetLayout();
   }

   //-------------------------------------------------------------------------------------------------------------
   function resetLayout()
   {
      //xDelta = graphPoints.maxX - graphPoints.originX;
      //yDelta = graphPoints.maxY - graphPoints.originY;
      //xPixels = canvasPoints.maxX - canvasPoints.originX;
      //yPixels = canvasPoints.maxY - canvasPoints.originY;
      
      xDelta = graphPoints.maxX - graphPoints.minX;
      yDelta = graphPoints.maxY - graphPoints.minY;
      xPixels = canvasPoints.maxX - canvasPoints.minX;
      yPixels = canvasPoints.maxY - canvasPoints.minY;

      canvasPoints.originX = marginLeft;
      //canvasPoints.originX = canvasPoints.maxX + (graphPoints.maxX * (yPixels / yDelta)); //TODO: this calcualtion is incorrect
      //canvasPoints.originY = graphCanvas.height-marginBottom-yOriginOffset;
      canvasPoints.originY = canvasPoints.maxY + (-graphPoints.maxY * (yPixels / yDelta));
   }

   //-------------------------------------------------------------------------------------------------------------
   function drawBorder()
   {
      graphCanvasCtx.strokeStyle = "#000000";
      graphCanvasCtx.beginPath();
      graphCanvasCtx.rect(0, 0, graphCanvas.width, graphCanvas.height);
      graphCanvasCtx.stroke();
   }

   //-------------------------------------------------------------------------------------------------------------
   function drawTitle()
   {
      graphCanvasCtx.fillStyle = "#000000";
      graphCanvasCtx.font = fontSize + "px Arial";
      graphCanvasCtx.textAlign = "center";
      graphCanvasCtx.fillText(title, graphCanvas.width/2, fontSize);
   }

   //-------------------------------------------------------------------------------------------------------------   
   function drawAxes()
   {
      graphCanvasCtx.strokeStyle = "#000000";
      //y-axis
      graphCanvasCtx.beginPath();
      //graphCanvasCtx.moveTo(marginLeft, marginTop);
      //graphCanvasCtx.lineTo(marginLeft, graphCanvas.height-marginBottom);
      graphCanvasCtx.moveTo(canvasPoints.originX, marginTop);
      graphCanvasCtx.lineTo(canvasPoints.originX, graphCanvas.height-marginBottom);
      graphCanvasCtx.stroke();
      //x-axis
      graphCanvasCtx.beginPath(); 
      //graphCanvasCtx.moveTo(marginLeft, graphCanvas.height-marginBottom);
      //graphCanvasCtx.lineTo(graphCanvas.width-marginRight, graphCanvas.height-marginBottom);
      graphCanvasCtx.moveTo(marginLeft, canvasPoints.originY);
      graphCanvasCtx.lineTo(graphCanvas.width-marginRight, canvasPoints.originY);
      graphCanvasCtx.stroke();
   }

   //-------------------------------------------------------------------------------------------------------------
   function drawAxesTitles()
   {
      graphCanvasCtx.fillStyle = "#000000";
      //x-axis
      graphCanvasCtx.font = fontSize + "px Arial";
      graphCanvasCtx.textAlign = "center";
      graphCanvasCtx.fillText("X-AXIS", graphCanvas.width/2, graphCanvas.height-(margin-fontSize));
      //y-axis
      graphCanvasCtx.save();
      graphCanvasCtx.translate(margin-5, graphCanvas.height/2);
      graphCanvasCtx.rotate(-Math.PI/2);
      graphCanvasCtx.textAlign = "center";
      graphCanvasCtx.fillText("Y-AXIS", 0, 0);
      graphCanvasCtx.restore();
   }

   //-------------------------------------------------------------------------------------------------------------
   function drawGraph()
   {
      for(index in graphPointArray)
      {
          var x = graphPointArray[index][0];
          var yValues = graphPointArray[index][1];

          for(yIndex in yValues)
          {
             //TODO: handle multiple y values
             //if(yIndex > 0) { continue; }

             //plotPoint(x, yValues[yIndex]);

             if(index > 0)
             {
                //alert(index + ":" + x + ":" + yValues[yIndex] + ":" + graphPointArray[index-1][0] + ":" + graphPointArray[index-1][1][yIndex]);
                plotLine(x, yValues[yIndex], graphPointArray[index-1][0], graphPointArray[index-1][1][yIndex], yIndex);
             }
          }
      }
   }

   //-------------------------------------------------------------------------------------------------------------
   function plotPoint(x, y, yIndex)
   {
      var plotX = canvasPoints.originX + (x * (xPixels / xDelta));
      var plotY = canvasPoints.originY + (y * (yPixels / yDelta));

      var size = 4;
      graphCanvasCtx.fillRect(plotX-(size/2), plotY-(size/2), size, size);
   }

   //-------------------------------------------------------------------------------------------------------------
   function plotLine(pointFromX, pointFromY, pointToX, pointToY)
   {
      graphCanvasCtx.strokeStyle = colors[yIndex];

      var plotX1 = canvasPoints.originX + (pointFromX * (xPixels / xDelta));
      var plotY1 = canvasPoints.originY + (pointFromY * (yPixels / yDelta));

      var plotX2 = canvasPoints.originX + (pointToX * (xPixels / xDelta));
      var plotY2 = canvasPoints.originY + (pointToY * (yPixels / yDelta));

      graphCanvasCtx.beginPath();
      graphCanvasCtx.moveTo(plotX1, plotY1);
      graphCanvasCtx.lineTo(plotX2, plotY2);
      graphCanvasCtx.stroke();
   }

   //-------------------------------------------------------------------------------------------------------------
   function drawValues()
   {
      //x-axis origin value
      graphCanvasCtx.font = fontSize + "px Arial";
      graphCanvasCtx.fillText(graphPoints.originX, canvasPoints.originX, canvasPoints.originY + fontSize);

      //x-axis min value
      graphCanvasCtx.fillText(graphPoints.minX, canvasPoints.minX, canvasPoints.originY + fontSize);

      //x-axis max value
      graphCanvasCtx.fillText(graphPoints.maxX, canvasPoints.maxX, canvasPoints.originY + fontSize);

      //y-axis origin value
      graphCanvasCtx.fillText(graphPoints.originY, canvasPoints.originX-fontSize, canvasPoints.originY);

      //y-axis min value
      graphCanvasCtx.fillText(graphPoints.minY, canvasPoints.originX-fontSize, canvasPoints.minY);

      //y-axis max value
      graphCanvasCtx.fillText(graphPoints.maxY, canvasPoints.originX-fontSize, canvasPoints.maxY);
   }

   //-------------------------------------------------------------------------------------------------------------
   function getMousePosition(canvas, anEvent, action)
   {
      var canvasRect = canvas.getBoundingClientRect();
      var x = anEvent.clientX - canvasRect.left;
      var y = anEvent.clientY - canvasRect.top;
      document.getElementById("coordinates").innerHTML = "Mouse Coordinates (" + action + "): (" + x + ", " + y +")" //+ 
           //" (" + anEvent.clientX + ", " + anEvent.clientY +")" +
           //" (" + canvasRect.left + ", " + canvasRect.top +")"
           ;
      return {x:x, y:y};
   }

   //-------------------------------------------------------------------------------------------------------------
   graphCanvas.addEventListener('mousemove', function(anEvent)
   {
      getMousePosition(graphCanvas, anEvent, "Move");
   }, false);
}




