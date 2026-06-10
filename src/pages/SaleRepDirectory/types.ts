export interface SalesRep {
  id: string;
  name: string;
  nickname: string;
  mobile: string;
  email: string;
  region: string;
  team: string;
  status: string;
  target: number;
  joinDate: string;
  avatar: string;
  lineId: string;
  notes: string;
}

export const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Bangkok & Metropolitan'];
export const TEAMS = ['Modern Trade', 'Traditional Trade', 'HORECA', 'Corporate B2B', 'Export'];
export const STATUSES = ['Active', 'On Leave', 'Inactive'];

export const THEME = {
  bgMain: 'transparent', 
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1f2a44 0%, #202024 100%)', 

  primary: '#f47729', 
  primaryDark: '#ad7332',
  accent: '#af7a2b', 
  textMain: '#2e3118', 
  textMuted: '#53483e', 
  textSubtle: '#8c7361', 
  cardBg: '#FFFFFF',
  success: '#606934', 
  palette: {
    gold: '#af7a2b', navyDeep: '#091d38', navy: '#214573', orangeBright: '#f47729', olive: '#606934', blueMuted: '#5167a2', darkOlive: '#2e3118', warmGray: '#53483e', warmBrown: '#93644b', sageTeal: '#7c9d9c', deepTeal: '#426a77', earthyBrown: '#836350', lightAqua: '#5da7b3', slateBlue: '#627680', dustyRose: '#bf8f7e', darkKhaki: '#5e4b2b', bronze: '#ad7332', silver: '#adb2b0', taupe: '#8c7361', lightTan: '#d2af94', wipPurple: '#735f82'
  }
};

export const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return `bg-green-50 text-[#606934] border-[#606934]/30`;
        case 'INACTIVE': return 'bg-slate-100 text-slate-500 border-slate-200';
        case 'ON LEAVE': return `bg-amber-50 text-amber-600 border-amber-200`;
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
};

export const getTeamStyle = (team: string) => {
    switch (team?.toUpperCase()) {
        case 'MODERN TRADE': return `bg-[#f47729]/10 text-[#f47729] border-[#f47729]/30`;
        case 'HORECA': return `bg-[#5da7b3]/10 text-[#5da7b3] border-[#5da7b3]/30`;
        case 'TRADITIONAL TRADE': return `bg-[#af7a2b]/10 text-[#af7a2b] border-[#af7a2b]/30`;
        case 'CORPORATE B2B': return `bg-[#606934]/10 text-[#606934] border-[#606934]/30`;
        case 'EXPORT': return `bg-[#5167a2]/10 text-[#5167a2] border-[#5167a2]/30`;
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
};
