import React from 'react';
import { 
  FileText, 
  Users, 
  Award,
  Building2,
  GraduationCap,
  Calendar,
  CircleUser,
  Flag,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Circle,
  Share2
} from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

const Dashboard = () => {
  // Stats data for first row
  const statsRow1 = [
    { number: '6', label: 'Federations', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
    { number: '6', label: 'Clubs', icon: Award, color: 'bg-red-100 text-red-600' },
    { number: '43', label: 'Club Players', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
    { number: '78', label: 'Sport Teams', icon: Flag, color: 'bg-yellow-100 text-yellow-600' },
    { number: '12', label: 'Team Players', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
    { number: '23', label: 'Officials & Players', icon: Flag, color: 'bg-green-100 text-green-600' }
  ];

  // Stats data for second row
  const statsRow2 = [
    { number: '09', label: 'Isonga program', icon: Award, color: 'bg-red-100 text-red-600' },
    { number: '45', label: 'Students', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
    { number: '12', label: 'Infrastructure', icon: Building2, color: 'bg-green-100 text-green-600' },
    { number: '23', label: 'Documents', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
    { number: '6', label: 'Appoitment', icon: Calendar, color: 'bg-yellow-100 text-yellow-600' },
    { number: '6', label: 'Employees', icon: FileText, color: 'bg-indigo-100 text-indigo-600' }
  ];

  // Live matches data
  const liveMatches = [
    {
      competition: 'RPL | Match - 8',
      team1: { name: 'APR FC', logo: '/teams/apr-fc.svg', score: 2 },
      team2: { name: 'Amagaju', logo: '/teams/amagaju.svg', score: 4 },
      venue: 'Amahoro Stadium',
      time: '33:30'
    },
    {
      competition: 'RBL Game - 4',
      team1: { name: 'REG', logo: '/teams/reg.svg', score: 2 },
      team2: { name: 'Patriots', logo: '/teams/patriots.svg', score: 4 },
      venue: 'BK ARENA',
      time: '33:30'
    },
    {
      competition: 'RPL | Match - 8',
      team1: { name: 'BUGESERA FC', logo: '/teams/bugesera-fc.svg', score: 2 },
      team2: { name: 'Amagaju', logo: '/teams/amagaju.svg', score: 4 },
      venue: 'Bugesera Stadium',
      time: '33:30'
    },
    {
      competition: 'RPL | Match - 8',
      team1: { name: 'AS KIGALI', logo: '/teams/as-kigali.svg', score: 2 },
      team2: { name: 'Amagaju', logo: '/teams/amagaju.svg', score: 4 },
      venue: 'PELE Stadim',
      time: '33:30'
    }
  ];

  // Add leagues data
  const leagues = [
    { 
      name: 'RPL', 
      logo: '/logos/rpl.svg',
      color: 'bg-blue-900'
    },
    { 
      name: 'RBL', 
      logo: '/logos/rbl.svg',
      color: 'bg-blue-500'
    },
    { 
      name: 'FRVB', 
      logo: '/logos/frvb.svg',
      color: 'bg-purple-900'
    },
    { 
      name: 'TRDR', 
      logo: '/logos/tour.svg',
      color: 'bg-white'
    },
    { 
      name: 'BAL', 
      logo: '/logos/handball.svg',
      color: 'bg-green-600'
    },
    { 
      name: 'NPC', 
      logo: '/logos/npc.svg',
      color: 'bg-gray-200'
    }
  ];

  // Add frame data
  const frameData = {
    title: 'THE ASHES 2023',
    image: '/frames/ashes.jpg',
    buttonText: 'FOR STATS, LATEST SCORES & NEWS!',
    liveImage: '/frames/stadium.jpg',
    viewers: '2.5k Users',
    watchLiveText: 'Watch Live'
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Stats Grid */}
      <div className="space-y-4 mb-8">
        {/* First Row of Stats */}
        <div className="grid grid-cols-6 gap-4">
          {statsRow1.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center">
              <div className={`${stat.color} p-3 rounded-full mb-3`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold mb-1">{stat.number}</span>
              <span className="text-gray-600 text-sm text-center">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Second Row of Stats */}
        <div className="grid grid-cols-6 gap-4">
          {statsRow2.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center">
              <div className={`${stat.color} p-3 rounded-full mb-3`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold mb-1">{stat.number}</span>
              <span className="text-gray-600 text-sm text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Matches Section */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-6">
          <Carousel>
            <CarouselContent>
              {liveMatches.map((match, index) => (
                <CarouselItem key={index} className="basis-1/4 pl-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">{match.competition}</span>
                      <div className="flex items-center">
                        <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
                        <span className="text-sm text-red-500">Live</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <img src={match.team1.logo} alt={match.team1.name} className="h-8 w-8" />
                        <span>{match.team1.name}</span>
                      </div>
                      <span className="text-lg font-bold">{match.team1.score}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <img src={match.team2.logo} alt={match.team2.name} className="h-8 w-8" />
                        <span>{match.team2.name}</span>
                      </div>
                      <span className="text-lg font-bold">{match.team2.score}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{match.venue}</span>
                      <span>{match.time}</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* Leagues and Frames Section */}
      <div className="flex gap-6">
        {/* Leagues Section */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Leagues To Browse</h2>
            <button className="text-gray-500 hover:text-gray-600 flex items-center">
              View all
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
          
          <div className="relative">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-4 min-w-max pb-4">
                {leagues.map((league, index) => (
                  <div 
                    key={index}
                    className={`${league.color} rounded-xl w-[160px] aspect-square flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105`}
                  >
                    <img 
                      src={league.logo} 
                      alt={league.name} 
                      className="h-16 w-16 mb-3" 
                    />
                    <span className={`text-center font-medium ${
                      league.name === 'TRDR' || league.name === 'NPC' 
                        ? 'text-gray-900' 
                        : 'text-white'
                    }`}>
                      {league.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Frames Section */}
        <div className="w-[400px] space-y-4">
          {/* The Ashes Banner */}
          <div className="bg-[#003F2E] rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <img src="/frames/ashes-logo.png" alt="The Ashes" className="h-10" />
                <span className="text-white font-bold text-lg">THE ASHES 2023</span>
              </div>
              <button className="w-full bg-[#92C83E] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 text-sm">
                FOR STATS, LATEST SCORES & NEWS!
              </button>
            </div>
          </div>

          {/* Stadium Live Stream */}
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src="/frames/stadium.jpg" 
              alt="Stadium Live" 
              className="w-full aspect-[4/3] object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60">
              {/* Top Bar */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <Users className="text-white h-4 w-4" />
                <span className="text-white text-sm">2.5k Users</span>
              </div>

              {/* Share Button */}
              <button className="absolute top-4 right-4 text-white">
                <Share2 className="h-4 w-4" />
              </button>

              {/* Watch Live Button */}
              <button className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full flex items-center space-x-2 hover:bg-red-600 text-sm">
                <Circle className="h-3 w-3 fill-current" />
                <span>Watch Live</span>
              </button>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === 0 ? 'bg-red-500' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 