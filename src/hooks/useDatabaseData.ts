import { useState, useEffect } from 'react';
import { Person } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const useDatabaseData = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDatabaseData = async () => {
      if (!isSupabaseConfigured()) {
        setError('Database not configured');
        setLoading(false);
        return;
      }

      try {
        const { data, error: queryError } = await supabase
          .from('user_sessions')
          .select('*')
          .order('created_at', { ascending: false });

        if (queryError) throw queryError;

        const mappedPeople: Person[] = data.map((record: any) => ({
          firstName: record.first_name,
          lastName: record.last_name,
          idNumber: record.id_number,
          affiliation: record.affiliation,
          dateOfBirth: record.date_of_birth,
          uniqueId: record.unique_id,
          createdAt: record.created_at
        }));

        setPeople(mappedPeople);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadDatabaseData();
  }, []);

  const findPersonByUniqueId = (uniqueId: string): Person | undefined => {
    return people.find(person => person.uniqueId === uniqueId);
  };

  return { people, loading, error, findPersonByUniqueId };
}; 