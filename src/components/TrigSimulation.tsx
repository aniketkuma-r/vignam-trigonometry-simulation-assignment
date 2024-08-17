import React, { useEffect, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { RxReset } from "react-icons/rx";
import { FaRegBuilding } from "react-icons/fa";
import { AiOutlineZoomIn } from "react-icons/ai";
import { HiOutlineZoomOut } from "react-icons/hi";
import { calculateAngle, calculateDistance } from "../utils/angleCalc.ts";
import ConnectorLine from "./ConnectorLine.tsx";

type Point = {
  x: number;
  y: number;
};

function App() {
  const [showBuilding1, setShowBuilding1] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [building1, setBuilding1] = useState<Point>({ x: 100, y: 100 });
  const [building2, setBuilding2] = useState<Point>({ x: 1100, y: 200 });
  const [personGround, setPersonGround] = useState<Point>({ x: 700, y: 700 });
  const [pointOfSight1, setPointOfSight1] = useState<Point>({ x: 850, y: 550 });
  const [pointOfSight2, setPointOfSight2] = useState<Point>({ x: 900, y: 350 });
  const [angleofInclination, setAngleofInclination] = useState<number>(0);
  const [angleofDeclination, setAngleofDeclination] = useState<number>(0);
  const [anglebetweengroundandbuilding, setAnglebetweengroundandbuilding] =
    useState<number>(0);
  const [
    distancebetweenbuildingandGround,
    setDistancebetweenbuildingandGround,
  ] = useState<number>(0);
  const [heightOfBuilding1, setHeightofBuilding1] = useState<number>(0);
  const [heightOfBuilding2, setHeightofBuilding2] = useState<number>(0);
  const [cameraview, setCameraview] = useState<string>("none");

  const handleDrag = (e:DraggableEvent, data: DraggableData, setPosition:any) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    const lineAngle = parseFloat(
      calculateAngle(
        personGround.x + 100,
        pointOfSight1.y,
        pointOfSight1.x,
        700 - 40
      ).toFixed(2)
    );
    setAngleofInclination(lineAngle);
  }, [personGround, pointOfSight1]);

  useEffect(() => {
    const lineAngle = parseFloat(
      calculateAngle(
        pointOfSight2.x,
        pointOfSight2.y,
        1100 + 25,
        building2.y - 30
      ).toFixed(2)
    );
    setAngleofDeclination(lineAngle);
  }, [building2, pointOfSight2]);

  useEffect(() => {
    const lineAngle = parseFloat(
      calculateAngle(
        personGround.x + 100,
        building2.y - 30,
        1100 + 25,
        700 - 40
      ).toFixed(2)
    );
    setAnglebetweengroundandbuilding(lineAngle);
  }, [building2, personGround]);

  useEffect(() => {
    const distance = calculateDistance(personGround.x + 200, 0, building2.x, 0);
    setDistancebetweenbuildingandGround(distance);
  }, [personGround, building2.x]);

  useEffect(() => {
    const distance = calculateDistance(0, building2.y, 0, personGround.y);
    setHeightofBuilding2(distance);
  }, [building2.y, personGround.y]);

  useEffect(() => {
    const distance = calculateDistance(0, building1.y, 0, personGround.y);
    setHeightofBuilding1(distance);
  }, [building1.y, personGround.y]);

  const getCameraView = () => {
    const inclinationAngle = Math.round(angleofInclination);
    const groundBuildingAngle = Math.round(anglebetweengroundandbuilding);

    if (inclinationAngle > groundBuildingAngle) return "Sky";
    if (inclinationAngle < groundBuildingAngle) return "Building";
    return "Person";
  };

  return (
    <div
      className="w-screen h-screen bg-blue-200 relative text-white overflow-hidden"
      style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: "center",
      }}
    >
      {/* menu */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-700 p-3 rounded-md">
        <ul className="flex gap-5 px-2">
          <button
            className="p-2 rounded-md text-black bg-slate-50"
            onClick={() => setShowBuilding1((prev) => !prev)}
          >
            <FaRegBuilding />
          </button>

          <button
            className="p-2 rounded-md text-black bg-slate-50"
            onClick={() =>
              setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2))
            }
          >
            <AiOutlineZoomIn />
          </button>
          <button
            className="p-2 rounded-md text-black bg-slate-50"
            onClick={() =>
              setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5))
            }
          >
            <HiOutlineZoomOut />
          </button>
          <button
            className="p-2 rounded-md text-black bg-slate-50"
            onClick={() => {
              setShowBuilding1(false);
            }}
          >
            <RxReset />
          </button>
        </ul>
      </div>
      {/* camera */}
      <div className="absolute top-28 left-1/2 transform -translate-x-1/2 mix-blend-darken">
        {/* <img src="camera.png" alt="camera" width="150" /> */}
        <p className=" bg-red-300 text-black">{cameraview}</p>
      </div>

      {/* building1 */}
      {showBuilding1 && (
        <Draggable
          axis="y"
          onDrag={(e, data) => handleDrag(e, data, setBuilding1)}
          defaultPosition={{ y: building1.y, x: 100 }}
        >
          <div className="absolute w-60 h-[900px] border-2 border-gray-900 rounded-lg cursor-move">
            <div className="absolute left-2 bottom-[-20px] text-sm">
              {heightOfBuilding1} meter
            </div>
          </div>
        </Draggable>
      )}

      {/* building2 */}
      {showBuilding1 && (
        <>
          <Draggable
            axis="y"
            onDrag={(e, data) => handleDrag(e, data, setBuilding2)}
            defaultPosition={{ y: building2.y, x: 1100 }}
          >
            <div className="absolute w-80 h-[900px] border-2 border-gray-900 rounded-lg cursor-move">
              <div className="absolute left-[-50px] top-[50px] text-black">
                {heightOfBuilding2} m
              </div>
              <div className="absolute top-[-40px] left-10 -translate-x-1/2 w-10 h-10 border-2 border-gray-600 rounded-full flex items-center justify-center text-sm text-black">
                Person2
                <div className="absolute top-[10px] left-[-70px] text-sm text-black">
                  {angleofDeclination} °
                </div>
              </div>
            </div>
          </Draggable>

          {/* pointOfSight2 */}
          <Draggable
            onDrag={(e, data) => handleDrag(e, data, setPointOfSight2)}
            defaultPosition={{ x: pointOfSight2.x, y: pointOfSight2.y }}
          >
            <div className="cursor-move absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 border-2 border-gray-600 rounded-full">
              point2
            </div>
          </Draggable>

          {/* Dashed Line Between Person 2 and Point of Sight 2 */}
          <ConnectorLine
            start={{ x: 1100 + 25, y: building2.y - 30 }}
            end={pointOfSight2}
          />
          <ConnectorLine
            start={{ x: 1100 + 25, y: building2.y - 30 }}
            end={{ x: 1100 - 200, y: building2.y - 30 }}
          />
        </>
      )}

      {/* personGround */}

      <Draggable
        axis="x"
        onDrag={(e, data) => handleDrag(e, data, setPersonGround)}
        defaultPosition={{ x: personGround.x, y: 700 }}
      >
        <div className="absolute w-[200px] h-10 border-2 border-gray-900 rounded-lg cursor-move">
          <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-10 h-10 border-2 border-gray-600 rounded-full flex items-center justify-center text-sm text-black">
            Person1
            <div className="absolute top-[-30px] right-[-40px] text-sm text-black">
              {angleofInclination} °
            </div>
            <button
              className="absolute top-[-30px] left-[-40px] border-2 px-2 py-1 border-gray-600 rounded-md flex items-center justify-center text-sm text-black"
              onClick={() => setCameraview(getCameraView())}
            >
              Click
            </button>
          </div>
          <div className="absolute right-[-50px] text-sm text-black">
            {distancebetweenbuildingandGround} m
          </div>
        </div>
      </Draggable>

      {/* pointOfSight1 */}
      <Draggable
        onDrag={(e, data) => handleDrag(e, data, setPointOfSight1)}
        defaultPosition={{ x: pointOfSight1.x, y: pointOfSight1.y }}
      >
        <div className="cursor-move absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 border-2 border-gray-600 rounded-full">
          point1
        </div>
      </Draggable>

      {/* Dashed Line Between Person 1 and Point of Sight 1 */}
      <ConnectorLine
        start={{ x: personGround.x + 100, y: 700 - 40 }}
        end={pointOfSight1}
      />
      <ConnectorLine
        start={{ x: personGround.x + 100, y: 700 - 40 }}
        end={{ x: personGround.x + 300, y: 700 - 40 }}
      />
    </div>
  );
}

export default App;
