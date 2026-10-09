import request from '../utils/request';

export const getBalance = (): Promise<{ gold: number; message: string }> => {
    return request.get('/gold/balance');
};

export const purchaseDrama = (dramaId: number): Promise<{ message: string }> => {
    return request.post(`/gold/purchase/${dramaId}`);
};