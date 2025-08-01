import React from 'react'
import {  useCopilotChat } from "@copilotkit/react-core";
import { TextMessage, Role } from "@copilotkit/runtime-client-gql";



type Charity = {
  title: string;
  description: string;
  url: string;
}   

const CharityCard: React.FC<{ charity: Charity,setActiveTab:(tab: string) => void }> = ({ charity,setActiveTab }) => {

  const { appendMessage } = useCopilotChat();

  const handleLearnMore = async () => {
    try {
      setActiveTab('Charities')
      await appendMessage(new TextMessage({
        role: Role.User,
        content: `Learn more about ${charity.title}`
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  // Generate random data for demonstration
  // const rating = Math.floor(Math.random() * 20) + 80 // 80-99%
  // const fundingNeed = Math.floor(Math.random() * 90000) + 10000 // $10k-$100k
  // const matchScore = Math.floor(Math.random() * 30) + 70 // 70-99%
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{charity.title}</h3>
        {/* <div className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {rating}%
        </div> */}
      </div>
      
      <p className="text-gray-600 mb-6">{charity.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Funding Need</p>
          <p className="font-bold text-gray-800">-</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Cause Area</p>
          <p className="font-bold text-gray-800">-</p>
        </div>
        {/* <div>
          <p className="text-sm text-gray-500 mb-1">Match Score</p>
          <p className="font-bold text-gray-800">{matchScore}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Tax Deductible</p>
          <p className="font-bold text-gray-800">Yes</p>
        </div> */}
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={() => window.open(charity.url, '_blank')}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 hover:cursor-pointer transition-colors flex-1">
          View Website
        </button>
        <button 
        onClick={handleLearnMore}
        className="border border-primary text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/10 hover:cursor-pointer transition-colors flex-1">
          Learn More
        </button>
      </div>
    </div>
  )
}

export const Charities = ({ charities,setActiveTab }: { charities: Charity[],setActiveTab:(tab: string) => void }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {charities.map((charity, index) => (
          <CharityCard key={index} charity={charity} setActiveTab={setActiveTab} />
        ))}
      </div>
    </div>
  )
}