import React from 'react';
import { Link } from 'react-router-dom';
import data from '../data';

const BankList = () => {
    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center">
            <div className="flex flex-col gap-5 w-11/12">
                <h1 className="text-2xl font-bold mb-5">Bank List</h1>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
                    <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                        <thead>
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                    Bank Name
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.banks.map((bank, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                                    <td className="whitespace-nowrap px-4 py-2">
                                        <Link to={`/banks/${index}`} className="text-blue-600 hover:underline">
                                            {bank.name}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BankList;
