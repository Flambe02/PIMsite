import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PayslipLine } from "@/types";

interface PayslipLinesProps {
  itens: PayslipLine[];
}

export function PayslipLines({ itens }: PayslipLinesProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Descrição</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Referência</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Vencimentos</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Descontos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((item, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">
                {item.descricao}
              </TableCell>
              <TableCell className="text-right text-gray-600">
                {item.referencia || '—'}
              </TableCell>
              <TableCell className="text-right font-medium text-green-700">
                {item.venc ? `R$ ${item.venc.toFixed(2)}` : '—'}
              </TableCell>
              <TableCell className="text-right font-medium text-red-700">
                {item.desc ? `R$ ${item.desc.toFixed(2)}` : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 