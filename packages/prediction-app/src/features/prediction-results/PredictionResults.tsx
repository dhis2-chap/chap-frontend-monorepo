import React from 'react'
import ResultPanel from './ResultPanel/JobResultPanel'
import JobResultPanelHeader from './ResultPanel/JobResultPanelHeader'



interface Job {
  id : string,
  name : string,
  status : string,
  created : Date
}

export interface Result {
  id : string,
  name : string,
  created : Date
  completedAt : Date
}

export interface JobResult {
  id : string,
  name : string,
  status? : string,
  created : Date
  type : "job" | "result"
}


const fetched_jobs : Job[] = [
  {
    id : "1",
    name : "Prediction for East, West, North, South",
    status : "In progress..",
    created : new Date(2025, 6, 3, 1, 3, 3)
  },
  {
    id : "2",
    name : "Prediction for Bugesera",
    status : "Not started",
    created : new Date(2025, 6, 3, 1, 4, 3)
  },
  {
    id : "3",
    name : "Prediction for East, West, North, South",
    status : "In progress..",
    created : new Date(2025, 6, 3, 1, 2, 3)
  },
  {
    id : "3",
    name : "Prediction for East, West, North, South",
    status : "In progress..",
    created : new Date(2025, 6, 3, 1, 2, 3)
  },
  {
    id : "3",
    name : "Prediction for East, West, North, South",
    status : "Failed",
    created : new Date(2025, 6, 3, 1, 2, 3)
  },
]

const fetched_results : Result[] = [
  {
    id : "1",
    name : "Prediction for East, West, North, South",
    created : new Date(2025, 6, 3, 1, 3, 3),
    completedAt : new Date(2025, 6, 3, 1, 5, 3)
  },
  {
    id : "2",
    name : "Prediction for Bugesera",
    created : new Date(2025, 6, 3, 1, 4, 3),
    completedAt : new Date(2025, 6, 3, 1, 5, 3)
  },
  {
    id : "3",
    name : "Prediction for East, West, North, South",
    created : new Date(2025, 6, 3, 1, 2, 3),
    completedAt : new Date(2025, 6, 3, 1, 5, 3)
  },
  {
    id : "3",
    name : "Prediction for East, West, North, South",
    created : new Date(2025, 6, 3, 1, 2, 3),
    completedAt : new Date(2025, 6, 3, 1, 5, 3)
  },
]



const PredictionResults = () => {
  
  const getResults = () : JobResult[] => {
    const results : JobResult[] = []

    fetched_results.forEach((completed) => {
        results.push({
          id : completed.id,
          name : completed.name,
          created : completed.created,
          type : "result",
          status : ""
        })
    })

    fetched_jobs.forEach((job) => {
      results.push({
        id : job.id,
        name : job.name,
        status : job.status,
        created : job.created,
       type : "job"
      })
    })

    results.sort((a, b) => {
      if (a.type === b.type) {
        return a.created.getTime() - b.created.getTime();
      }
      return a.type === "job" ? -1 : 1;
    });

    return results 
  }
  
  return (
    <div>

    
        <JobResultPanelHeader/>
          <ResultPanel jobResults={getResults()}/>

    
    </div>

  )
}

export default PredictionResults