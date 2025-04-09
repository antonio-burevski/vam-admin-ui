import {Container, Title} from "@mantine/core";
import {StatsGroup} from "./mock-containers/StatsGroup.tsx";
import {StatsGrid} from "./mock-containers/StatsGrid.tsx";

const Dashboard = () => {
    return (
        <Container fluid style={{display: "block", marginTop: "1rem"}}>
            <Title style={{marginBottom: "1rem"}}>Dashboard</Title>
            <StatsGrid/>
            <StatsGroup/>
        </Container>
    );
};

export default Dashboard;