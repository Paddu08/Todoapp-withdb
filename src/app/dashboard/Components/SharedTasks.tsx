import { getSharedTasksByAuthId } from "@/lib/query/getSharedTasksCurrUser";
import { currentUser } from "@clerk/nextjs/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge'; // make sure Badge import is correct

export default async function SharedTasks() {
  const user = await currentUser();
  const authId = user?.id;

  if (!authId) {
    return <p className="p-8 text-center text-lg">Please log in to see your dashboard.</p>;
  }

  const sharedTodos = await getSharedTasksByAuthId(authId);
  console.log(sharedTodos)

  if (sharedTodos.length === 0) {
    return <p className="text-gray-500 italic">No tasks shared yet!</p>;
  }

  return (
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow className="hover:bg-gray-50">
          <TableHead className="w-[30%] text-indigo-700">Title</TableHead>
          <TableHead className="w-[40%] text-indigo-700">Shared by</TableHead>
          <TableHead className="w-[20%] text-indigo-700 text-center">Access</TableHead>
          <TableHead className="w-[10%] text-indigo-700 text-center">Status</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {sharedTodos.map((task) => (
          <TableRow key={task.shareId}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell className="text-sm text-gray-500 max-w-xs truncate">{task.userId || '—'}</TableCell>
            <TableCell className="text-center">
              <Badge
                variant={task.access === 'read' ? 'secondary' : 'default'}
                className={`
                  ${task.access === 'read'
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    : 'bg-green-500 hover:bg-green-600'}
                  shadow-md transition-colors duration-150
                `}
              >
                {task.access === 'read' ? 'Read' : 'Write'}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge
                variant="outline"
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-150"
              >
                Shared
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
