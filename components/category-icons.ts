import { createElement } from "react";
import {
  Activity, BadgePercent, Battery, BatteryFull, Blocks, BookOpen, Bot, Box, Boxes, Briefcase, Camera, Car, CarFront, Cctv,
  CircleDot, CloudSun, Cog, Container, Disc, Drill, Drone, Droplet, Eye, Fan, Fish, Flag, Flame, FlameKindling, Forklift, Fuel, Gauge,
  Gem, Glasses, Hammer, HardDrive, Heart, Helicopter, House, Lightbulb, Magnet, Mic, Package, PaintBucket, Paintbrush, Pipette, Plane, Plug, PlugZap,
  Printer, Puzzle, Radar, Radio, Rocket, Route, Sailboat, SatelliteDish, ScanLine, Scooter, Send, Server, Shield, ShieldCheck, Ship, Shirt, Sun,
  Target, ThumbsUp, Train, TrainTrack, Trees, Truck, Usb, Video, Wrench, Zap, type LucideIcon,
} from "lucide-react";

/** Elefun tags categories with Font Awesome names; these are the closest Lucide shapes. */
const ICONS:Record<string,LucideIcon>={
  "3dprint":Printer,"print":Printer,"scanner-gun":ScanLine,"bore-hole":Drill,"lazer":Zap,"compact-disc":Disc,"bottle-water":Droplet,
  "bolt":Zap,"battery-full":BatteryFull,"car-battery":Battery,"charging-station":PlugZap,"plug":Plug,"plug-circle-bolt":PlugZap,"shield-check":ShieldCheck,
  "fire-extinguisher":Flame,"dumpster-fire":FlameKindling,"smoke":CloudSun,"car-tilt":CarFront,"road":Route,"truck-monster":Truck,"car-side":Car,
  "forklift":Forklift,"truck-moving":Container,"tank":Shield,"boat":Ship,"ship":Ship,"sailboat":Sailboat,"fishing-rod":Fish,"drone":Drone,
  "drone-front":Drone,"dji":Drone,"suitcase":Briefcase,"briefcase":Briefcase,"inbox-in":Box,"sun-cloud":CloudSun,"propeller":Fan,"propeller3":Fan,
  "plane":Plane,"paper-plane":Send,"paper-plane-top":Send,"helicopter":Helicopter,"helicopter-symbol":Helicopter,"lightbulb-on":Lightbulb,
  "user-pilot":Glasses,"head-side-goggles":Glasses,"desktop":Gauge,"video":Video,"camera-security":Camera,"camera-cctv":Cctv,"microphone":Mic,
  "sd-card":HardDrive,"usb-drive":Usb,"satellite-dish":SatelliteDish,"block-brick":Blocks,"warhammer":Hammer,"tree-christmas":Trees,
  "eye-dropper":Pipette,"fill-drip":PaintBucket,"square-heart":Heart,"train":Train,"train-track":TrainTrack,"traincar":Train,"house":House,
  "trees":Trees,"gear":Cog,"gears":Cog,"engine":Cog,"servo":Activity,"explosion":Flame,"parachute-box":Package,"gauge-high":Gauge,"boxes-packing":Boxes,
  "server":Server,"screwdriver":Wrench,"screwdriver-wrench":Wrench,"flag-checkered":Flag,"skate":Scooter,"scooter":Scooter,"thumbs-up":ThumbsUp,
  "sun":Sun,"solar-panel":Sun,"bullseye-arrow":Target,"flying-disc":CircleDot,"magnet":Magnet,"detector":Radar,"raspberry-pi":Puzzle,"robot":Bot,
  "vacuum-robot":Bot,"glasses":Glasses,"walkie-talkie":Radio,"gas-pump":Fuel,"bearing":CircleDot,"spray-can":Paintbrush,"bottle-droplet":Droplet,
  "pallet":Boxes,"oil-can":Droplet,"book":BookOpen,"shirt":Shirt,"badge-percent":BadgePercent,"rocket":Rocket,"rocket-launch":Rocket,"sensor-on":Eye,
  "ribbon":Gem,
};

export const iconFor=(name?:string,fallback?:string):LucideIcon=>ICONS[name??""]??ICONS[fallback??""]??Box;

export function CategoryIcon({name,fallback,size}:{name?:string;fallback?:string;size:number}){
  return createElement(iconFor(name,fallback),{size,"aria-hidden":true});
}
