import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountMinute, Separator, StartCountdownButton, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import zod from 'zod';

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

export function Home(){

    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    function handleCreateNewCycle(data: NewCycleFormData) {
        reset();
    }

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
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton
                    disabled={!task}
                    type="submit">
                    <Play size={24}/> 
                    Começar 
                </StartCountdownButton>
            </form>
        </HomeContainer>
    );
}