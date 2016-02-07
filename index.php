<?php
    if(array_key_exists("image", $_FILES)){
        $tmp_name = $_FILES["image"]["tmp_name"];
        $name = $_FILES["image"]["name"];
        if(move_uploaded_file($tmp_name, "images/".$name)){
        
          echo "images/".$name;
        }else{
            echo "AAA!";
        }
    }else if(array_key_exists("api_request", $_POST)){
        if($_POST["api_request"] == "save_and_download"){
            // this doesn't currently quite seem to work?
            $tmp_name = $_FILES["savedImage"]["tmp_name"];
            $name = tempnam("saved_images", "fractal-").".png";
            if(move_uploaded_file($tmp_name, $name)){
            
              echo $name;
            }else{
                echo "AAA!";
            }
        }else if($_POST["api_request"] == "save_fractal_data"){
            $fractals = json_decode(file_get_contents("fractal_data.json"), true);
            $fractals[$_POST["id"]] = $_POST["data"];
            file_put_contents("fractal_data.json",json_encode($fractals));
        }
    }else{
        echo "<html>"; ?>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
  <link rel="stylesheet" type="text/css" href="css/main.min.css">
  <?php 
      if(array_key_exists("fractal_id", $_GET)){
          $fractals = json_decode(file_get_contents("fractal_data.json"), true);
          if(array_key_exists($_GET["fractal_id"], $fractals)){
              echo '<meta id="fractalData" preset="true" json="';
              $encoded = $fractals[$_GET["fractal_id"]];
              $encoded = str_replace('"'. '\\"');
              echo $encoded.'">';
          }else{
              echo '<meta id="fractalData" preset="false">'
          }
      }
  ?>
</head>
<body>
    <script id="2d-vertex-shader" type="x-shader/x-vertex">
        attribute vec2 a_position;
        
        uniform float u_zoom;
        uniform vec2 u_loc;
        uniform vec2 u_size;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
    </script>
    <script id="2d-fragment-shader" type="x-shader/x-fragment">
    </script>
    <script src="js/main.min.js"></script>

    <canvas id="glscreen"></canvas>
    <button class="menu-button hidden" id="open-button" onclick="openMenu()">Open Menu</button>
    <div id="controls" class="expanded">
    <div style="position:absolute">
        <span class="tab active" id="fractalTab">Fractals</span> <span class="tab" id="renderTab">Renderer</span>
        <div id="fractalControls">
            <select id="fractal0" class="recompile mySelect">
            </select>
            <button id="addFractal" onclick="addFractal()" type="button"> + add fractal </button>
            <button id="removeFractal" onclick="removeFractal()" type="button" class="hidden"> - remove fractal </button>
            <div>Iterations:
                <input type="range" name="iterations" id="iterations" min="1" max="300" value="100" class="recompile myRange">
            </div>
            <br />
            <div>
                <input type="checkbox" name="julia" value="1" id="julia" checked class="recompile myCheck">Use Julia
                <br />
                <div id="juliaControls" class="subcontrols">
                    Julia Controls: <br />
                    <input type="checkbox" value="1" id="juliaMouse"class="myCheck">Mouse Control<br />
                    x: <input type="range" step="any" id="juliaX" min="-1" max="1" value="0" class="myRange"><br />
                    y: <input type="range" step="any" id="juliaY" min="-1" max="1" value="0" class="myRange">
                </div> 
            </div>
            <div>Escape Shape:<br /> 
                <input type="radio" name="escape" value="normal" checked class="recompile myRadio">Circle<br />
                <input type="radio" name="escape" value="square" class="recompile myRadio">Square<br />
                <input type="radio" name="escape" value="diamond" class="recompile myRadio">Diamond
            </div>
         </div>
        <div id="renderControls" class="hidden">
            <select id="renderer" name="renderer" class="recompile mySelect">
            </select><br />
            <input type="checkbox" class="recompile" id="colorCycle" checked/> Cycle Colors <br />
            <div class="subcontrols">Antialiasing:
                <select id="aaingSelect" class="recompile mySelect">
                    <option>None</option>
                    <option>Simple Grid</option>
                    <option>Random</option>
                    <option>Gausian Grid</option>
                <select>
                <br />
                Antialiasing Amount:
                <input type="range" id="aaingRange" min="0" max="100" value="16" class="recompile myRange" />
            </div>
            <div id="waveControls" class="subcontrols hidden">
                Wave Count: <input type="range" class="recompile myRange" id="waveCount" min=".5" max="20" value="5"><br />
                Wave Phase: <input type="range" class="recompile myRange" id="wavePhase" min="0" max="6.28" value="0">
            </div>
            <div id="iterControls" class="subcontrols hidden">
                Count Iterations: 
                    <input type="range" class="recompile myRange" id="iterSkip" min="1" max="20" value="1"><br />
            </div>
            <div id="orbitImage" class="subcontrols hidden">
                Select Image from File:<br />
                <input id="fileLoader" type="file" name="image"/>
                Size:       <input type="range" class="myRange" min="0.01" max=".8" step="any" value=".5" id="orbitSize"/><br />
            </div>
            <select id="setColorPallet" class="mySelect">
                <option>B&W</option>
                <option>Dijital Elefan</option>
                <option>Rainbow</option>
                <option>Strawberries</option>
                <option>Sorbet</option>
                <option>Sunset</option>
                <option>Cotton Candy</option>
                <option>Vintage</option>
                <option>Orchid</option>
                <option>Random</option>
            </select>
            <input id="gradientSelector" type="gradient" style="width:200px;color:#fff;"></input>

        </div>
        <div id="otherControls">
            <div id="uniformControls" class="subcontrols hidden">
                Display Parameters:<br />
            </div>
            <div>
            <a href="#" id="renderLarge" type="button" class="myButton" >Render Large</button>
            <a href="#" id="download" type="button" class="myButton"><i class="fa fa-download"></i> Download</a>
            
            <button type="button" class="myButton" onclick="generateLink(this)"><i class="fa fa-link"></i> Create Link</a>
            </div>
        </div>
     </div>
        <button class="close-button" id="close-button" onclick="closeMenu()">Close Menu</button>
    </div>
</body>
</html>
<?php
  
    }
?>