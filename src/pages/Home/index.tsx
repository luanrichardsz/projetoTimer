import { HandPalm, Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountMinute, Separator, StartCountdownButton, TaskInput, StopCountdownButton } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from 'zod';
import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5).max(60),
})
/*
interface NewCycleFormData {
    task: string
    minutesAmount: number
}
*/

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    isActive: boolean
    interruptedDate?: Date
    finishedDate?: Date
}

export function Home(){
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [ActiveCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)  


    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const activeCycle = cycles?.find(cycle => cycle.id == ActiveCycleId)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    useEffect(() => {
        let interval: number;

        if(activeCycle){
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);
                
                if(secondsDifference >= totalSeconds){
                    setCycles(
                        state => state.map((cycle) => {
                            if (cycle.id == ActiveCycleId) {
                                return { ...cycle, finishedDated: new Date() }
                            } else {
                                return cycle
                            }
                        }),
                    )
                    setAmountSecondsPassed(totalSeconds)
                    clearInterval(interval)
                } else {
                setAmountSecondsPassed(secondsDifference)
            }
            }, 1000) 
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, ActiveCycleId])

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            isActive: true,
            startDate: new Date()
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)
        
        
        reset()
    }

    function handleInterruptCycle() {
        setCycles(
            state => state.map((cycle) => {
                if (cycle.id == ActiveCycleId) {
                    return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )

        setActiveCycleId(null)
    }

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if(activeCycle){
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    const task = watch('task')


    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="">Vou trabalhar em</label>

                    <TaskInput 
                        id="task" 
                        list="task-suggestions" 
                        placeholder="Dê um nome para seu projeto" 
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"/>
                        <option value="Banana"/>
                    </datalist>

                    <label htmlFor="">durante</label>
                    <MinutesAmountMinute 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00" 
                        step={5} 
                        min={5} 
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                { activeCycle ? (
                        <StopCountdownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24}/> 
                            Interromper 
                        </StopCountdownButton>
                         ) : (
                        <StartCountdownButton
                        disabled={!task}
                        type="submit">
                        <Play size={24}/> 
                            Começar 
                        </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    );
}