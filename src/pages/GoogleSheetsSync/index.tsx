import React, { useState, useEffect } from 'react';
import { Database, Zap, RefreshCw, Key, FileText, CheckCircle2, Loader2, Link2, PlusCircle, LayoutGrid } from 'lucide-react';
import { googleSignIn, initAuth, logoutGoogle, getAccessToken } from '../../services/FirebaseAuth';
import { THEME } from '../../theme';
import Swal from 'sweetalert2';

export default function GoogleSheetsSync() {
    const [needsAuth, setNeedsAuth] = useState(true);
    const [userContext, setUserContext] = useState<any>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [sheetUrl, setSheetUrl] = useState('');

    useEffect(() => {
        const unsubscribe = initAuth(
            (user, token) => {
                setNeedsAuth(false);
                setUserContext(user);
            },
            () => {
                setNeedsAuth(true);
                setUserContext(null);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            const result = await googleSignIn();
            if (result) {
                setNeedsAuth(false);
                setUserContext(result.user);
            }
        } catch (err) {
            console.error('Login failed:', err);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Could not authenticate with Google. Please try again.',
                confirmButtonColor: '#f47729'
            });
        } finally {
            setIsLoggingIn(false);
        }
    };
    
    // Function to run formatting and setup
    const formatSpreadsheet = async (sid: string) => {
        const token = await getAccessToken();
        if(!token) throw new Error("No access token");
        
        // Setup initial headers
        const headers = ["ID", "DATE", "DOCUMENT_TYPE", "STATUS", "AMOUNT", "CUSTOMER", "NOTES"];
        
        // 1. Write headers
        const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/A1:G1?valueInputOption=USER_ENTERED`;
        const updateBody = { values: [headers] };
        
        await fetch(updateUrl, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(updateBody)
        });

        // 2. Format: freeze row 1, color row 1 to #d0e0e3, make it bold
        const formatBody = {
            requests: [
                {
                    updateSheetProperties: {
                        properties: {
                            gridProperties: { frozenRowCount: 1 }
                        },
                        fields: "gridProperties.frozenRowCount"
                    }
                },
                {
                    repeatCell: {
                        range: {
                            startRowIndex: 0,
                            endRowIndex: 1,
                            startColumnIndex: 0, 
                            endColumnIndex: headers.length
                        },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 208/255, green: 224/255, blue: 227/255 },
                                textFormat: { bold: true },
                                horizontalAlignment: "CENTER"
                            }
                        },
                        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                }
            ]
        };

        const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sid}:batchUpdate`;
        await fetch(batchUpdateUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(formatBody)
        });
    };
    
    const handleRunSetup = async () => {
        if (!spreadsheetId.trim()) {
            Swal.fire('Required', 'Please enter a Spreadsheet ID', 'warning');
            return;
        }
        
        const confirmed = window.confirm(`Are you sure you want to run setup on Spreadsheet ID: ${spreadsheetId}? This will overwrite row 1 and change formatting.`);
        if(!confirmed) return;

        setIsProcessing(true);
        try {
            await formatSpreadsheet(spreadsheetId.trim());
            
            Swal.fire({
                icon: 'success',
                title: 'Setup Complete',
                text: 'Spreadsheet has been formatted with headers and frozen rows.',
                confirmButtonColor: THEME.primary
            });
            setSheetUrl(`https://docs.google.com/spreadsheets/d/${spreadsheetId.trim()}/edit`);
        } catch (error) {
            console.error('Setup error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Setup Failed',
                text: 'Make sure the ID is correct and you have edit permission.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCreateSheet = async () => {
        setIsProcessing(true);
        try {
            const token = await getAccessToken();
            if(!token) throw new Error("No token");
            
            // Create a new sheet
            const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    properties: { title: "Procurement Sub-System DB" }
                })
            });
            const data = await res.json();
            const sid = data.spreadsheetId;
            setSpreadsheetId(sid);
            
            // Proceed to format it
            await formatSpreadsheet(sid);
            
            Swal.fire({
                icon: 'success',
                title: 'Spreadsheet Created & Formatted',
                text: 'New database spreadsheet is ready to use.',
                confirmButtonColor: THEME.primary
            });
            setSheetUrl(`https://docs.google.com/spreadsheets/d/${sid}/edit`);
        } catch (error) {
           console.error('Creation error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Creation Failed',
                text: 'Could not create spreadsheet.',
            }); 
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
            {/* Header SECTION (Matched User Permissions Specs: px-8, pt-3, pb-5) */}
            <div className="px-4 sm:px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 bg-transparent">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Database size={28} strokeWidth={2.5} className="text-[#f47729]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            GOOGLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">SHEETS SYNC</span> NODE
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            DATABASE SYNCHRONIZATION AND CONNECTION SETUP
                        </p>
                    </div>
                </div>
                {userContext && (
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            {userContext.photoURL ? (
                                <img src={userContext.photoURL} alt="User" />
                            ) : (
                                <div className="w-full h-full bg-[#f47729] text-white flex items-center justify-center font-bold">
                                    {userContext.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-800">{userContext.email}</span>
                            <span className="text-[9px] text-emerald-600 font-black tracking-widest uppercase">Connected</span>
                        </div>
                        <button onClick={logoutGoogle} className="ml-2 text-slate-400 hover:text-red-500">
                            <RefreshCw size={14} />
                        </button>
                    </div>
                )}
            </div>

            <div className="px-4 sm:px-8 mt-2 pb-6">
                <div className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* AUTHENTICATION CARD */}
                        <div className="bg-white rounded-3xl shadow-lg border border-[#e2d1c3] overflow-hidden animate-fadeIn h-fit">
                            <div className="px-6 py-4 border-b border-[#e2d1c3] bg-[#f8f9fa]">
                                <h4 className="text-[14px] font-black uppercase text-[#2e3118] tracking-widest flex items-center gap-3">
                                    <Key size={18} className="text-[#f47729]" />
                                    AUTHENTICATION
                                </h4>
                            </div>
                            <div className="p-6 md:p-8 space-y-6">
                                <p className="text-[#627680] text-sm font-medium">
                                    Connect your Google Account to authorize database synchronizations and create sheets automatically.
                                </p>
                                
                                {needsAuth ? (
                                    <button onClick={handleLogin} disabled={isLoggingIn} className="gsi-material-button w-full bg-white border border-[#dadce0] rounded-xl cursor-pointer flex items-center justify-center px-4 py-3 hover:bg-[#f8f9fa] shadow-sm transition-all text-[#3c4043] font-black tracking-widest text-[12px] uppercase h-[54px]">
                                        <div className="mr-3 w-5 h-5 flex items-center justify-center bg-white rounded-sm">
                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                                <path fill="none" d="M0 0h48v48H0z"></path>
                                            </svg>
                                        </div>
                                        {isLoggingIn ? 'CONNECTING...' : 'SIGN IN WITH GOOGLE'}
                                    </button>
                                ) : (
                                    <div className="inline-flex w-full items-center justify-center px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-200">
                                        <CheckCircle2 size={16} className="mr-2" />
                                        Successfully authenticated and ready to sync.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SETUP & FORMATTING CARD */}
                        <div className={`bg-white rounded-3xl shadow-lg border border-[#e2d1c3] overflow-hidden animate-fadeIn transition-opacity ${needsAuth ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="px-6 py-4 border-b border-[#e2d1c3] bg-[#f8f9fa]">
                                <h4 className="text-[14px] font-black uppercase text-[#2e3118] tracking-widest flex items-center gap-3">
                                    <LayoutGrid size={18} className="text-[#5da7b3]" />
                                    SHEET SETUP & FORMATTING
                                </h4>
                            </div>
                            <div className="p-6 md:p-8 space-y-8">
                                <p className="text-[#627680] text-sm font-medium">
                                    Automatically format the target spreadsheet (Adds headers, freezes top row, and highlights column #d0e0e3).
                                </p>
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black tracking-widest uppercase text-[#8c7361]">SPREADSHEET ID <span className="text-red-500">*</span></label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 1L7smTyoFDIRaQk-NDivWTMwqQ52V..." 
                                            value={spreadsheetId}
                                            onChange={e => setSpreadsheetId(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-[#f8f9fa] border border-[#e2d1c3] rounded-xl outline-none font-mono text-sm focus:border-[#f47729] focus:bg-white transition-all shadow-inner"
                                        />
                                        <button 
                                            onClick={handleRunSetup}
                                            disabled={isProcessing}
                                            className="px-8 h-[54px] bg-[#e2d1c3] hover:bg-[#d2af94] text-[#53483e] font-black uppercase text-[11px] tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
                                            RUN SETUP
                                        </button>
                                    </div>
                                </div>

                                <div className="relative pt-6 pb-2">
                                    <div className="absolute inset-x-0 top-[28px] h-[1px] bg-slate-100"></div>
                                    <div className="relative z-10 flex justify-center">
                                        <span className="bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleCreateSheet}
                                    disabled={isProcessing}
                                    className="w-full h-[54px] bg-[#f8f9fa] border border-[#e2d1c3] hover:border-[#f47729]/50 hover:bg-[#f47729]/5 rounded-xl flex items-center justify-center gap-3 text-[#2e3118] font-black uppercase text-[11px] tracking-widest transition-all shadow-sm"
                                >
                                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                                    CREATE NEW SPREADSHEET AUTOMATICALLY
                                </button>
                                
                                {sheetUrl && (
                                    <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fadeIn">
                                        <div className="flex items-center gap-2 text-emerald-800">
                                            <CheckCircle2 size={18} />
                                            <span className="text-sm font-bold">Spreadsheet is ready!</span>
                                        </div>
                                        <a href={sheetUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg text-emerald-700 text-xs font-black uppercase shadow-sm border border-emerald-200 hover:bg-emerald-50 transition-all">
                                            <Link2 size={14} /> Open in Google Sheets
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
