'use client';

import React, { useState } from 'react';
import { useEncrypt } from '@fhevm-example/sdk';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface MedicalRecord {
  id: string;
  type: string;
  value: number;
  unit: string;
  encrypted: boolean;
  timestamp: number;
  normal: boolean;
}

export const MedicalExample: React.FC = () => {
  const { encrypt16, isEncrypting } = useEncrypt();

  const [heartRate, setHeartRate] = useState<string>('72');
  const [bloodPressure, setBloodPressure] = useState<string>('120');
  const [glucose, setGlucose] = useState<string>('95');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [error, setError] = useState<string>('');

  const handleAddRecord = async (type: string, value: string, unit: string, normalRange: [number, number]) => {
    try {
      setError('');
      const numValue = parseInt(value);

      if (isNaN(numValue) || numValue <= 0) {
        setError('Please enter a valid value');
        return;
      }

      const encrypted = await encrypt16(numValue);

      const record: MedicalRecord = {
        id: Date.now().toString(),
        type,
        value: numValue,
        unit,
        encrypted: true,
        timestamp: Date.now(),
        normal: numValue >= normalRange[0] && numValue <= normalRange[1],
      };

      setRecords(prev => [record, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add record');
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Private Medical Records" subtitle="Encrypted health data with privacy preservation">
        <div className="space-y-4">
          <div>
            <Input
              type="number"
              label="Heart Rate (bpm)"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="Enter heart rate"
            />
            <div className="mt-2">
              <Button
                onClick={() => handleAddRecord('Heart Rate', heartRate, 'bpm', [60, 100])}
                disabled={isEncrypting}
                variant="primary"
                size="small"
              >
                {isEncrypting ? 'Adding...' : 'Add Heart Rate'}
              </Button>
            </div>
          </div>

          <div>
            <Input
              type="number"
              label="Blood Pressure (mmHg)"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="Enter systolic pressure"
            />
            <div className="mt-2">
              <Button
                onClick={() => handleAddRecord('Blood Pressure', bloodPressure, 'mmHg', [90, 140])}
                disabled={isEncrypting}
                variant="primary"
                size="small"
              >
                {isEncrypting ? 'Adding...' : 'Add Blood Pressure'}
              </Button>
            </div>
          </div>

          <div>
            <Input
              type="number"
              label="Blood Glucose (mg/dL)"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              placeholder="Enter glucose level"
            />
            <div className="mt-2">
              <Button
                onClick={() => handleAddRecord('Blood Glucose', glucose, 'mg/dL', [70, 100])}
                disabled={isEncrypting}
                variant="primary"
                size="small"
              >
                {isEncrypting ? 'Adding...' : 'Add Glucose'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Medical Records" subtitle="Encrypted health data history">
        {records.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No records yet
          </div>
        ) : (
          <div className="space-y-2">
            {records.map(record => (
              <div
                key={record.id}
                className={`p-4 rounded-lg border ${
                  record.normal
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{record.type}</div>
                    <div className="text-xs text-gray-600">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {record.value} {record.unit}
                    </div>
                    <div className="text-xs">
                      <span className={record.normal ? 'text-green-600' : 'text-yellow-600'}>
                        {record.normal ? 'Normal' : 'Attention'}
                      </span>
                      {' • '}
                      <span className="text-gray-500">Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h4 className="font-bold text-purple-700 mb-2">Privacy in Healthcare</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-700">
            <li>All medical data is encrypted before storage</li>
            <li>Only authorized medical staff can access records</li>
            <li>Analysis can be performed on encrypted data</li>
            <li>Compliance with HIPAA and privacy regulations</li>
            <li>Patient maintains full control of their data</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
