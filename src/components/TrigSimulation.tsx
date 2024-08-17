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
  const [cameraview, setCameraview] = useState<string | null>(null);

  const handleDrag = (
    e: DraggableEvent,
    data: DraggableData,
    setPosition: any
  ) => {
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
        building2.y + 30
      ).toFixed(2)
    );
    setAngleofDeclination(lineAngle);
  }, [building2, pointOfSight2]);

  useEffect(() => {
    const lineAngle = parseFloat(
      calculateAngle(
        personGround.x + 100,
        building2.y + 30,
        1100 + 25,
        700 - 40
      ).toFixed(2)
    );
    setAnglebetweengroundandbuilding(lineAngle);
  }, [building2, personGround]);

  useEffect(() => {
    const distance = calculateDistance(personGround.x + 100, 0, building2.x, 0);
    setDistancebetweenbuildingandGround(distance);
  }, [personGround, building2.x]);

  useEffect(() => {
    const distance = calculateDistance(0, building2.y, 0, personGround.y - 100);
    setHeightofBuilding2(distance);
  }, [building2.y, personGround.y]);

  useEffect(() => {
    const distance = calculateDistance(0, building1.y, 0, personGround.y - 100);
    setHeightofBuilding1(distance);
  }, [building1.y, personGround.y]);

  const getCameraView = () => {
    const inclinationAngle = Math.round(angleofInclination);
    const groundBuildingAngle = Math.round(anglebetweengroundandbuilding);

    if (inclinationAngle > groundBuildingAngle) return "sky";
    if (inclinationAngle < groundBuildingAngle) return "building";
    return "person";
  };

  return (
    <div
      className="w-screen h-screen bg-sky-200 relative text-white overflow-hidden"
      style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: "center",
      }}
    >
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(Group.png)",
          opacity: 0.3,
          zIndex: 1,
        }}
      ></div>
      <div className="relative z-10">
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
                setCameraview(null);
              }}
            >
              <RxReset />
            </button>
          </ul>
        </div>
        
        <div
          className="absolute w-48 h-32 top-28 left-1/2 bg-contain bg-center bg-no-repeat transform -translate-x-1/2"
          style={{
            backgroundImage: "url(camera.png)",
          }}
        >
          <div className="absolute top-[43px] left-[19px] w-[80px] h-[67px]">
            {cameraview && (
            <img
              src={`${cameraview}.png`}
              alt="view"
              className="w-full h-full object-cover object-top"
            />
          )}
          </div>
        </div>

        {/* building1 */}
        {showBuilding1 && (
          <Draggable
            axis="y"
            onDrag={(e, data) => handleDrag(e, data, setBuilding1)}
            defaultPosition={{ y: building1.y, x: 100 }}
          >
            <div
              className="absolute w-80 h-[1100px] inset-0 bg-contain bg-center bg-no-repeat cursor-move"
              style={{
                backgroundImage: "url(Group40315.png)",
              }}
            >
              <div className="absolute right-[-80px] top-[100px] text-green-800">
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
              <div
                className="absolute w-80 h-[1100px] inset-0 bg-contain bg-center bg-no-repeat cursor-move"
                style={{
                  backgroundImage: "url(Group40314.png)",
                }}
              >
                <div className="absolute left-[-50px] top-[100px] text-black">
                  {heightOfBuilding2} m
                </div>
                <div className="absolute top-[30px] left-[-70px] text-sm text-black">
                  {angleofDeclination} °
                </div>
              </div>
            </Draggable>

            {/* pointOfSight2 */}
            <Draggable
              onDrag={(e, data) => handleDrag(e, data, setPointOfSight2)}
              defaultPosition={{ x: pointOfSight2.x, y: pointOfSight2.y }}
            >
              <div
                className="absolute w-10 h-10 inset-0 -left-5 -top-5 bg-cover bg-center bg-no-repeat cursor-move"
                style={{
                  backgroundImage: "url(Group40327.png)",
                  zIndex: 1,
                }}
              ></div>
            </Draggable>

            {/* Dashed Line Between Person 2 and Point of Sight 2 */}
            <ConnectorLine
              start={{ x: 1100 + 25, y: building2.y + 30 }}
              end={pointOfSight2}
            />
            <ConnectorLine
              start={{ x: 1100 + 25, y: building2.y + 30 }}
              end={{ x: 1100 - 200, y: building2.y + 30 }}
            />
          </>
        )}

        {/* personGround */}
        <Draggable
          axis="x"
          onDrag={(e, data) => handleDrag(e, data, setPersonGround)}
          defaultPosition={{ x: personGround.x, y: 700 }}
        >
          <div
            className="absolute w-80 h-[300px] -top-36 inset-0 bg-cover bg-no-repeat cursor-move"
            style={{
              backgroundImage: "url(Group40512.png)",
            }}
          >
            <div className="absolute top-[100px] right-[80px] text-black">
              {angleofInclination} °
            </div>
            <button
              className="absolute top-[50px] left-[40px] border-2 px-2 py-1 border-gray-600 bg-slate-500 rounded-md flex items-center justify-center text-sm text-white font-semibold"
              onClick={() => setCameraview(getCameraView())}
            >
              Click
            </button>
            <div className="absolute right-[-80px] top-[120px] text-sm text-black">
              {distancebetweenbuildingandGround} m
            </div>
          </div>
        </Draggable>

        {/* pointOfSight1 */}
        <Draggable
          onDrag={(e, data) => handleDrag(e, data, setPointOfSight1)}
          defaultPosition={{ x: pointOfSight1.x, y: pointOfSight1.y }}
        >
          <div
            className="absolute w-10 h-10 inset-0 -left-5 -top-5 bg-cover bg-center bg-no-repeat cursor-move"
            style={{
              backgroundImage: "url(Group40327.png)",
              zIndex: 1,
            }}
          ></div>
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
    </div>
  );
}

export default App;
