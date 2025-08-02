import React from "react"
import { useCopilotChat } from "@copilotkit/react-core";


interface CharityData {
    name: string;
    description: string;
    url: string;
    detailed_info: {
        name: string;
        url: string;
        mission: string;
        impact: string;
        programs: string[];
        financials: {
            revenue: string;
            expenses: string;
            efficiency: string;
        };
        leadership: string[];
        ratings: {
            charity_navigator: string;
            guidestar: string;
            other_ratings: string;
        };
        location: string;
        founded: string;
        size: string;
        beneficiaries: string;
        transparency: string;
        recent_news: string[];
        strengths: string[];
        concerns: string[];
        donation_info: {
            how_to_donate: string;
            tax_deductible: string;
            donation_options: string[];
        };
    };
}

const CharityCard = ({ charity }: { charity: CharityData }) => {
    const { detailed_info } = charity;

    return (
        <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary mb-2">
                            {charity.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{charity.description}</p>
                        {detailed_info.founded !== "Not available" && (
                            <p className="text-sm text-gray-500">Founded: {detailed_info.founded}</p>
                        )}
                    </div>
                    <a
                        href={charity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                        Visit Website
                    </a>
                </div>
            </div>

            {/* Mission & Impact */}
            <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Mission & Impact</h4>
                <p className="text-gray-700 text-sm mb-2">{detailed_info.mission}</p>
                <p className="text-gray-600 text-sm">{detailed_info.impact}</p>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {detailed_info.location !== "Not available" && (
                    <div>
                        <span className="font-medium text-gray-700">Location: </span>
                        <span className="text-gray-600">{detailed_info.location}</span>
                    </div>
                )}
                {detailed_info.beneficiaries !== "Not available" && (
                    <div>
                        <span className="font-medium text-gray-700">Beneficiaries: </span>
                        <span className="text-gray-600">{detailed_info.beneficiaries}</span>
                    </div>
                )}
            </div>

            {/* Programs */}
            {detailed_info.programs.length > 0 && detailed_info.programs[0] !== "Not available" && (
                <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Programs</h4>
                    <div className="flex flex-wrap gap-2">
                        {detailed_info.programs.map((program, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {program}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Strengths */}
            {detailed_info.strengths.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                        {detailed_info.strengths.map((strength, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                            >
                                {strength}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Donation Info */}
            <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Donation Information</h4>
                <div className="space-y-1 text-sm">
                    <p className="text-gray-600">{detailed_info.donation_info.how_to_donate}</p>
                    <p className="text-gray-600">{detailed_info.donation_info.tax_deductible}</p>
                    {detailed_info.donation_info.donation_options.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {detailed_info.donation_info.donation_options.map((option, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                >
                                    {option}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CharitiesTab = ({ charities }: { charities: CharityData[] }) => {

    const {isLoading} = useCopilotChat()
    

      if(isLoading){
        return (
            <div className="flex w-full h-screen items-center justify-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                <span className="ml-3 text-xl text-gray-600">Loading charities...</span>
            </div>
        );
      }  
    
      return (
         <div className=" flex-1 overflow-hidden w-full h-screen overflow-y-auto p-10 bg-[#FCFCF9]">
            <div className="space-y-8 pb-10 bg-[#FCFCF9]">
                {charities && charities.length > 0 ? (
                    <div className="space-y-6 h-screen overflow-y-auto">
                        {charities.map((charity, idx) => (
                            <CharityCard key={idx} charity={charity} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No charities found yet.</p>
                )}
            </div>
        </div>
    );
};


export default CharitiesTab