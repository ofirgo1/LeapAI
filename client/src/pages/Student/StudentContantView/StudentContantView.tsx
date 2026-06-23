
import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Content, getContantById } from '../../../api/contantApi';
import Summary from '../../ContentTypesView/Summary/Summary';
import Quiz from '../../ContentTypesView/Quiz/Quiz';

export default function StudentContentView() {
    const { id } = useParams();
    const [content, setContent] = useState<Content | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const items = await getContantById(id!);
                setContent(items);
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [id]);
    console.log(content);

    return ( content?.type === 'summary' ? (
        <Summary />
    ) : content?.type === 'quiz' ? (
        <Quiz/>
    ) : content?.type === 'test' ? (
        <Navigate to={`/student/quiz/${content.id}`} replace />
    ) : !loading ? (
        <>Content not found</>
    ) : <> </>);
   
}
