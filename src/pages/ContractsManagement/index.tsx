import React, { useState } from 'react';
import { 
  FileText, Search, Plus, Filter, Download, MoreHorizontal, FileSignature, 
  CheckCircle2, Clock, XCircle, AlertCircle
} from 'lucide-react';
import { DataExport } from '../../components/shared/DataExport';
import { DraggableModal } from '../../components/shared/DraggableModal';

const DUMMY_DATA = [
  { id: 1, contractNo: 'CTR-2026-001', customer: 'Global Foods Ltd', type: 'Annual Supply', startDate: '2026-01-01', endDate: '2026-12-31', status: 'Active', value: '$120,000' },
  { id: 2, contractNo: 'CTR-2026-002', customer: 'Asian Mart Corp', type: 'OEM Agreement', startDate: '2026-03-15', endDate: '2027-03-14', status: 'Pending Signature', value: '$85,000' },
  { id: 3, contractNo: 'CTR-2025-089', customer: 'EuroRetail BV', type: 'Distributor', startDate: '2025-06-01', endDate: '2026-05-31', status: 'Expiring Soon', value: '$250,000' },
];

export default function ContractsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredContracts = DUMMY_DATA.filter(c => 
      c.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2e3118] uppercase tracking-tight flex items-center gap-2">
            <FileSignature size={24} className="text-[#f47729]" />
            Contracts Management
          </h2>
          <p className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest mt-1">
            Manage customer agreements and OEM contracts
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <DataExport
              data={filteredContracts}
              columns={[
                  { key: 'contractNo', label: 'Contract No' },
                  { key: 'customer', label: 'Customer' },
                  { key: 'type', label: 'Type' },
                  { key: 'startDate', label: 'Start Date' },
                  { key: 'endDate', label: 'End Date' },
                  { key: 'value', label: 'Value' },
                  { key: 'status', label: 'Status' }
              ]}
              filename="Contracts_Management"
          />
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-none bg-[#f47729] hover:bg-[#ad7332] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#f47729] h-[40px]"
          >
            <Plus size={16} /> NEW CONTRACT
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-between z-10 relative">
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
              <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                      type="text" 
                      placeholder="Search contracts..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold text-[#091d38] focus:border-[#f47729] focus:ring-1 focus:ring-[#f47729] transition-all outline-none"
                  />
              </div>
              <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 h-[38px]">
                  <Filter size={14} /> STATUS: ALL
              </button>
          </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-black sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Contract Info</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12px] font-medium text-slate-700">
              {filteredContracts.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-black text-[#091d38] mb-1">{row.contractNo}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FileText size={12} className="text-[#f47729]" />
                        {row.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 text-[10px] font-black uppercase tracking-widest">
                        {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#091d38]">{row.startDate}</div>
                    <div className="text-[10px] text-slate-400 font-bold">to {row.endDate}</div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-[#5167a2]">{row.value}</td>
                  <td className="px-6 py-4">
                    {row.status === 'Active' && <span className="bg-[#EAF2EA] text-[#606934] px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max"><CheckCircle2 size={12}/> {row.status}</span>}
                    {row.status === 'Pending Signature' && <span className="bg-[#FFF5EB] text-[#ad7332] px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max"><Clock size={12}/> {row.status}</span>}
                    {row.status === 'Expiring Soon' && <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max"><AlertCircle size={12}/> {row.status}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#f47729] hover:bg-[#fff5eb] transition-all">
                            <Download size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#091d38] hover:bg-slate-100 transition-all">
                            <MoreHorizontal size={14} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                    No contracts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DraggableModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title={<span className="text-sm font-black uppercase text-[#091d38] tracking-widest flex items-center gap-2"><FileSignature size={16} className="text-[#f47729]"/> NEW CONTRACT</span>}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Contract No.</label>
                  <input type="text" className="w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-[#f47729] font-mono bg-slate-50" placeholder="AUTO-GENERATED" disabled />
              </div>
              <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Customer / Assignee</label>
                  <input type="text" className="w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-[#f47729]" placeholder="Enter Customer Name" />
              </div>
              <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Contract Type</label>
                  <select className="w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-[#f47729] bg-white">
                      <option>Annual Supply</option>
                      <option>OEM Agreement</option>
                      <option>Distributor</option>
                  </select>
              </div>
              <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Value (Est.)</label>
                  <input type="text" className="w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-[#f47729] font-mono" placeholder="$0.00" />
              </div>
              <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Start Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-[#f47729] font-mono" />
              </div>
              <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">End Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-[#f47729] font-mono" />
              </div>
              <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Notes / Terms</label>
                  <textarea rows={3} className="w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-[#f47729]" placeholder="Contract terms or internal notes..."></textarea>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                  <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded uppercase tracking-wider hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 bg-[#f47729] text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-[#ad7332] shadow-sm transition-colors">Save Contract</button>
              </div>
          </div>
      </DraggableModal>

    </div>
  );
}
