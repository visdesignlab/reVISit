## Firebase Collections

### provenance [collection of provenance events]

One document per participant_task combination

e.g: 545d6768fdf99b7f9fca24e3_S-task01

Each collection is made up of documents. 

##### Document structure in the provenance collection: 
	id: 545d6768fdf99b7f9fca24e3, 

	initialSetup : time this document was created,

	mode: "study" (we only want study mode, not develop, test, or heuristic)

	provGraphs:[] array of provenance events (which we need to feed into Kiran's library to recreate the proper provenance graph structure) 

update: same thing as initalSetup (not sure why this exists). 


### results_graded [collection of task results/answers/accuracy/feedback]

One document per user

e.g: 545d6768fdf99b7f9fca24e3

##### Document structure in the results collection: 

	S-task01 [string identifier for the task]: 

		{answer: object containing the participant answer for the task as well as accuracy. 
    
    	answerKey: the correct answer for the task. 
    
    	endTime: when the participant finished this task. 
    
    	feedback : {confidence: value, difficulty:value, explanation: ''}
    	}
    	
    hypothesis: hypothesis this task was meant to test. 
    
    minutesToComplete: //self explanatory,
    
    order: order it was presented 
    
    ... //more self explanatory fields
    
    workerID: id for the participant. Matches the 'id' field in the provenance documents. 
    



