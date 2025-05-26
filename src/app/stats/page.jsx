import fs from 'fs';
import path from 'path';
import StatsClient from './StatsClient';  

export default function StatsPage() {
  const filePath = path.join(process.cwd(), 'src', 'constant','oldSeason', 'stats','statsData.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const statsData = JSON.parse(jsonData);
 

  return <StatsClient statsData={statsData} />;
}
