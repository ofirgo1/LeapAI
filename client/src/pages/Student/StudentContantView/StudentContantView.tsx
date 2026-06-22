
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Content, getContantById } from '../../../api/contantApi';
import Summary from '../../ContentTypesView/Summary/Summary';
import Quiz from '../../ContentTypesView/Quiz/Quiz';

export default function StudentContentView() {
    const { id } = useParams();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const items = await getContantById(id!);
                setContent(items);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchContent();
    }, [id]);
    console.log(content);

    return ( content?.type === 'summary' ? (
        <Summary />
    ) : content?.type === 'multiple_choices' ? (
        <Quiz/>
    ) : (
        <>Content not found</>
    ));
   
}
